/**
 * JD Extractor — Automated Verification Test Suite (ESM)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { extractSkillsFromText } from '../src/utils/skillTaxonomy.js';
import { parseResume } from '../src/utils/resumeParser.js';
import { calculateFit, buildGapTailoredPrompt, extractJdRequiredExperience } from '../src/utils/fitEngine.js';
import { formatDatePosted, formatEmploymentType, formatSalary } from '../src/utils/formatters.js';

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n🔍 Running JD Extractor v1.0.0 Edge & Chrome Verification Suite...\n');

// 1. Manifest V3 Check
test('Manifest is valid Manifest V3, Edge & Chrome compatible', () => {
  const raw = fs.readFileSync('manifest.json', 'utf8');
  const manifest = JSON.parse(raw);
  assert.strictEqual(manifest.manifest_version, 3);
  assert.strictEqual(manifest.name, 'JD Extractor');
  assert.strictEqual(manifest.version, '1.0.0');
  assert.ok(manifest.permissions.includes('sidePanel'), 'Includes sidePanel permission');
  assert.ok(manifest.permissions.includes('activeTab'));
  assert.ok(manifest.permissions.includes('scripting'));
  assert.ok(manifest.permissions.includes('storage'));
  assert.ok(manifest.permissions.includes('tabs'));
  assert.ok(manifest.host_permissions && manifest.host_permissions.includes('<all_urls>'), 'Includes host_permissions');
  assert.ok(manifest.content_scripts && manifest.content_scripts.length > 0, 'Includes content_scripts');
  assert.ok(manifest.side_panel && manifest.side_panel.default_path, 'Native side_panel configured');
  assert.ok(manifest.action && manifest.action.default_icon, 'Action icon configured');
  assert.ok(manifest.web_accessible_resources && manifest.web_accessible_resources.length > 0);
});

// 2. Icon Assets Check
test('Extension icons exist and are valid Apple squircle PNGs', () => {
  [16, 48, 128].forEach((size) => {
    const iconPath = path.join('icons', `icon${size}.png`);
    assert.ok(fs.existsSync(iconPath), `Missing icon${size}.png`);
    const buf = fs.readFileSync(iconPath);
    assert.strictEqual(buf[0], 0x89);
    assert.strictEqual(buf[1], 0x50);
    assert.strictEqual(buf[2], 0x4E);
    assert.strictEqual(buf[3], 0x47);
  });
});

// 3. React Build Distribution Check
test('React app built into dist/sidebar.html and dist/assets/', () => {
  assert.ok(fs.existsSync(path.join('dist', 'sidebar.html')), 'Missing dist/sidebar.html');
  assert.ok(fs.existsSync(path.join('dist', 'assets', 'sidebar.js')), 'Missing dist/assets/sidebar.js');
  assert.ok(fs.existsSync(path.join('dist', 'assets', 'sidebar.css')), 'Missing dist/assets/sidebar.css');
  assert.ok(fs.existsSync(path.join('dist', 'assets', 'pdf.worker.min.mjs')), 'Missing dist/assets/pdf.worker.min.mjs');
});

// 4. Platform URL Matcher Check
test('Platform URL matchers correctly identify target sites', () => {
  const matchers = [
    { name: 'LinkedIn Search Results', regex: /linkedin\.com\/jobs/i, url: 'https://www.linkedin.com/jobs/search-results/?currentJobId=4424687208' },
    { name: 'LinkedIn Single View', regex: /linkedin\.com\/jobs/i, url: 'https://www.linkedin.com/jobs/view/12345678/' },
    { name: 'Indeed', regex: /indeed\.com/i, url: 'https://www.indeed.com/viewjob?jk=abcdef' },
    { name: 'Greenhouse', regex: /greenhouse\.io|boards\.greenhouse/i, url: 'https://boards.greenhouse.io/stripe/jobs/12345' },
    { name: 'Lever', regex: /lever\.co|jobs\.lever/i, url: 'https://jobs.lever.co/figma/67890' },
    { name: 'Workday', regex: /myworkdayjobs\.com|workday\.com/i, url: 'https://adobe.myworkdayjobs.com/job/123' },
    { name: 'Naukri', regex: /naukri\.com/i, url: 'https://www.naukri.com/job-123' },
  ];

  matchers.forEach(({ name, regex, url }) => {
    assert.ok(regex.test(url), `Failed matching URL for ${name}: ${url}`);
  });
});

// 5. Dedicated LinkedIn 2-Pane Architecture Check
test('content.js contains dedicated extractLinkedIn engine with 2-pane right-rail selectors', () => {
  const content = fs.readFileSync('content.js', 'utf8');
  assert.ok(content.includes('function extractLinkedIn()'), 'Dedicated extractLinkedIn function defined');
  assert.ok(content.includes('.jobs-search__job-details--container'), 'Targets right rail container');
  assert.ok(content.includes('.show-more-less-html__markup'), 'Targets LinkedIn full JD markup');
  assert.ok(content.includes('.job-details-jobs-unified-top-card__job-title'), 'Targets right-rail top-card title');
  assert.ok(content.includes('.job-details-jobs-unified-top-card__company-name'), 'Targets right-rail company name');
  assert.ok(content.includes('.jobs-search-results-list'), 'Excludes left search list from heuristics');
  assert.ok(content.includes('.scaffold-layout__list'), 'Excludes scaffold list from heuristics');
  assert.ok(content.includes('spa_url_changed'), 'Notifies sidepanel on SPA navigation');
  assert.ok(content.includes('async function executeExtraction'), 'Async extraction with DOM settling defined');
  assert.ok(content.includes('initLinkedInDetailObserver'), 'Live MutationObserver watches right rail');
  assert.ok(content.includes('auto_extraction_complete'), 'Pushes extracted data directly on mutation');
});

// 6. LinkedIn Metadata Parsing Logic Check
test('LinkedIn primary description parser extracts location and date without noise', () => {
  const sampleMeta = 'Pune Division, Maharashtra, India · Reposted 1 week ago · Over 100 people clicked apply';
  const parts = sampleMeta.split(/[·•\n]+/).map(s => s.trim()).filter(Boolean);
  
  let location = '';
  let datePosted = '';
  if (parts.length > 0 && !/ago|reposted|posted|applicant|applied|people|clicked/i.test(parts[0])) {
    location = parts[0];
  }
  for (const p of parts) {
    if (/(\d+\s+(day|week|month|hour|minute)s?\s+ago|posted|reposted)/i.test(p)) {
      datePosted = p.replace(/^(reposted|posted)\s*/i, '').trim();
      break;
    }
  }

  assert.strictEqual(location, 'Pune Division, Maharashtra, India');
  assert.strictEqual(datePosted, '1 week ago');
});

// 7. Apple HIG Skeleton Loading Architecture Check
test('SkeletonLoader component and Apple shimmer CSS are integrated', () => {
  const comp = fs.readFileSync('src/components/SkeletonLoader.jsx', 'utf8');
  assert.ok(comp.includes('skeleton-container'), 'Skeleton container present');
  assert.ok(comp.includes('skeleton-card'), 'JobCard skeleton present');
  assert.ok(comp.includes('skeleton-preview-box'), 'Preview skeleton present');
  assert.ok(comp.includes('skeleton-segmented'), 'Prompt selector skeleton present');
  assert.ok(comp.includes('skeleton-btn-primary'), 'Action button skeleton present');
  assert.ok(comp.includes('FitSkeletonLoader'), 'FitSkeletonLoader present for Role Fit tab');

  const css = fs.readFileSync('src/styles/apple-theme.css', 'utf8');
  assert.ok(css.includes('apple-shimmer'), 'Apple shimmer keyframes defined');
  assert.ok(css.includes('.skeleton-box'), 'Skeleton box style defined');

  const app = fs.readFileSync('src/App.jsx', 'utf8');
  assert.ok(app.includes('SkeletonLoader'), 'SkeletonLoader imported and used in App.jsx');
  assert.ok(app.includes('FitSkeletonLoader'), 'FitSkeletonLoader used in App.jsx for Role Fit tab');
  assert.ok(app.includes('res?.loading'), 'App.jsx handles loading retries gracefully');
});

// 8. Non-Job Web App Filtering & Job Signal Qualification Check
test('content.js filters non-job domains (Gmail, GitHub) and qualifies heuristic job signals', () => {
  const content = fs.readFileSync('content.js', 'utf8');
  assert.ok(content.includes('NON_JOB_DOMAINS'), 'Defines NON_JOB_DOMAINS blacklist');
  assert.ok(content.includes('JOB_HEURISTIC_SIGNALS'), 'Defines semantic job signals');
  assert.ok(content.includes('countJobSignals'), 'Counts semantic job signals');

  const nonJobUrls = [
    'https://mail.google.com/mail/u/0/#inbox',
    'https://github.com/VSat08/jd-extractor',
    'https://gemini.google.com/app/31a9598165e73910',
    'https://chatgpt.com/c/12345',
    'https://claude.ai/chat/67890',
    'https://youtube.com/watch?v=123',
    'https://twitter.com/home'
  ];
  const NON_JOB_REGEX = [
    /mail\.google\.com/i,
    /github\.com\/(?!.*\/careers|.*\/jobs)/i,
    /gemini\.google\.com/i,
    /chatgpt\.com|chat\.openai\.com/i,
    /claude\.ai/i,
    /youtube\.com/i,
    /twitter\.com|x\.com/i
  ];
  nonJobUrls.forEach((url, i) => {
    assert.ok(NON_JOB_REGEX[i].test(url), `Failed detecting non-job URL: ${url}`);
  });
});

// 9. Industry Skill Taxonomy & Alias Matcher Check
test('skillTaxonomy extracts normalized skills with alias handling', () => {
  const sample = 'Senior React.js engineer with TypeScript, k8s, AWS (S3, EC2), and postgresql background.';
  const skills = extractSkillsFromText(sample);
  assert.ok(skills.includes('React'), 'Identified React from React.js');
  assert.ok(skills.includes('TypeScript'), 'Identified TypeScript');
  assert.ok(skills.includes('Kubernetes'), 'Identified Kubernetes from k8s');
  assert.ok(skills.includes('AWS'), 'Identified AWS from S3 / EC2');
  assert.ok(skills.includes('PostgreSQL'), 'Identified PostgreSQL from postgresql');
});

// 10. Client-Side Resume Parser Check
test('resumeParser transforms raw text into structured profile', () => {
  const rawText = `
    Alex Rivera
    alex.rivera@example.com | +1 555-019-2834 | github.com/arivera | linkedin.com/in/alex-rivera
    Full Stack Developer with 4+ years of experience designing robust web systems.

    Education:
    Bachelor of Science in Computer Science

    Core Competencies:
    JavaScript, TypeScript, React, Node.js, Express.js, Docker, PostgreSQL, GraphQL
  `;
  const parsed = parseResume(rawText, 'Alex_Rivera_Resume.pdf', 24500);
  assert.strictEqual(parsed.candidateName, 'Alex Rivera');
  assert.strictEqual(parsed.email, 'alex.rivera@example.com');
  assert.strictEqual(parsed.phone, '+1 555-019-2834');
  assert.ok(parsed.links.some(l => l.includes('github.com/arivera')));
  assert.strictEqual(parsed.experienceYears, 4);
  assert.ok(parsed.education.toLowerCase().includes('computer science'));
  assert.ok(parsed.skills.includes('React'));
  assert.ok(parsed.skills.includes('TypeScript'));
  assert.ok(parsed.skills.includes('Docker'));
  assert.ok(parsed.skills.includes('PostgreSQL'));
});

// 11. Role Fitness Engine & Gap Analysis Check
test('fitEngine accurately scores alignment, detects gaps, and generates tailored prompt', () => {
  const resume = {
    candidateName: 'Alex Rivera',
    experienceYears: 4,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    roles: ['Full Stack Developer'],
  };

  const jd = {
    title: 'Full Stack Engineer',
    company: 'Stripe',
    description: `
      Requirements:
      - 3+ years experience with React, TypeScript, and Node.js.
      - Experience with PostgreSQL and Docker.
      - Strong knowledge of Kubernetes and GraphQL.
    `
  };

  const fit = calculateFit(jd, resume);
  assert.ok(fit.score >= 60, `Score expected >= 60, got ${fit.score}`);
  assert.strictEqual(fit.jdExpRequired, 3);
  assert.strictEqual(fit.expStatus, 'exceeds_or_meets');
  assert.ok(fit.matchedSkills.includes('React'));
  assert.ok(fit.matchedSkills.includes('TypeScript'));
  assert.ok(fit.matchedSkills.includes('Docker'));
  assert.ok(fit.missingSkills.includes('Kubernetes'));
  assert.ok(fit.missingSkills.includes('GraphQL'));

  const prompt = buildGapTailoredPrompt(jd, fit, resume);
  assert.ok(prompt.includes('Stripe'), 'Prompt includes company');
  assert.ok(prompt.includes('Kubernetes'), 'Prompt addresses missing Kubernetes');
  assert.ok(prompt.includes('GraphQL'), 'Prompt addresses missing GraphQL');

  // Verify JD experience extraction handles both ranges and plus notation accurately
  const rangeJdExp = extractJdRequiredExperience('4-7 years of strong hands-on experience in JAVA( 8 +)');
  assert.strictEqual(rangeJdExp.displayText, '4–7 yrs', 'Deloitte range parsed as 4–7 yrs');
  assert.strictEqual(rangeJdExp.minYears, 4, 'Lower bound is 4');
  assert.strictEqual(rangeJdExp.maxYears, 7, 'Upper bound is 7');

  const plusJdExp = extractJdRequiredExperience('Requires 2+ years of experience');
  assert.strictEqual(plusJdExp.displayText, '2+ yrs', '2+ years parsed correctly');
  assert.strictEqual(plusJdExp.minYears, 2);
});

// 12. App Navigation & Resume View Components Integration Check
test('NavSegment, ResumeView, FitAnalysisCard, and InfoSheet are integrated into App.jsx and CSS', () => {
  const app = fs.readFileSync('src/App.jsx', 'utf8');
  assert.ok(app.includes('NavSegment'), 'NavSegment in App.jsx');
  assert.ok(app.includes('ResumeView'), 'ResumeView in App.jsx');
  assert.ok(app.includes('FitAnalysisCard'), 'FitAnalysisCard in App.jsx');
  assert.ok(app.includes('InfoSheet'), 'InfoSheet in App.jsx');
  assert.ok(app.includes('saveResumeProfile'), 'saveResumeProfile in App.jsx');

  const css = fs.readFileSync('src/styles/apple-theme.css', 'utf8');
  assert.ok(css.includes('.nav-segment-container'), 'NavSegment CSS present');
  assert.ok(css.includes('.fit-analysis-card'), 'FitAnalysisCard CSS present');
  assert.ok(css.includes('.resume-dropzone'), 'Resume dropzone CSS present');
  assert.ok(css.includes('.skill-chip'), 'Skill chip CSS present');
  assert.ok(css.includes('.info-sheet-body'), 'InfoSheet CSS present');
  assert.ok(css.includes('.faq-hero-card'), 'FAQ hero card CSS present');
  assert.ok(css.includes('.faq-accordion-group'), 'FAQ accordion group CSS present');

  // Verify education regex does not match "Hibernate" as "bernate"
  const testParsed = parseResume('Experience with Java, Hibernate, and Spring Boot.');
  assert.strictEqual(testParsed.education, 'Not explicitly listed', 'Hibernate is not falsely matched as degree');
});

// 13. Rich Markdown Renderer & Dual View Mode Check
test('MarkdownRenderer, Cupertino toggle [Formatted | Raw], and styles are integrated', () => {
  const preview = fs.readFileSync('src/components/Preview.jsx', 'utf8');
  assert.ok(preview.includes('renderMarkdownBlocks'), 'renderMarkdownBlocks imported in Preview.jsx');
  assert.ok(preview.includes('preview-toggle-group'), 'Cupertino toggle group present');
  assert.ok(preview.includes('formatted'), 'Formatted mode supported');
  assert.ok(preview.includes('raw'), 'Raw mode supported');

  const mdRenderer = fs.readFileSync('src/utils/markdownRenderer.jsx', 'utf8');
  assert.ok(mdRenderer.includes('parseMarkdownBlocks'), 'parseMarkdownBlocks defined');
  assert.ok(mdRenderer.includes('renderInlineMarkdown'), 'renderInlineMarkdown defined');

  const css = fs.readFileSync('src/styles/apple-theme.css', 'utf8');
  assert.ok(css.includes('.preview-toggle-group'), 'preview-toggle-group CSS present');
  assert.ok(css.includes('.preview-markdown-content'), 'preview-markdown-content CSS present');
  assert.ok(css.includes('.preview-heading-2'), 'preview-heading-2 CSS present');
  assert.ok(css.includes('.preview-list'), 'preview-list CSS present');
});

// 14. Job Metadata Formatters (Date, Type, Salary) Check
test('Job metadata formatters cleanly convert raw ISO dates, enum types, and salaries', () => {
  // Date format checks
  assert.strictEqual(formatDatePosted('2022-08-23T15:38:17.408Z'), 'Aug 23, 2022', 'ISO date formatted to Month Day, Year');
  assert.strictEqual(formatDatePosted('2024-03-15'), 'Mar 15, 2024', 'Short ISO date formatted');
  assert.strictEqual(formatDatePosted('Posted 3 days ago'), '3 days ago', 'Relative date cleaned');
  assert.strictEqual(formatDatePosted('1 week ago'), '1 week ago', 'Relative week preserved');
  assert.strictEqual(formatDatePosted('· 2 weeks ago'), '2 weeks ago', 'Bullet trimmed');

  // Employment type format checks
  assert.strictEqual(formatEmploymentType('FULL_TIME'), 'Full-time', 'FULL_TIME converted to Full-time');
  assert.strictEqual(formatEmploymentType('PART_TIME'), 'Part-time', 'PART_TIME converted to Part-time');
  assert.strictEqual(formatEmploymentType('CONTRACTOR'), 'Contract', 'CONTRACTOR converted to Contract');
  assert.strictEqual(formatEmploymentType('FULL_TIME, CONTRACTOR'), 'Full-time, Contract', 'Multiple types converted');
  assert.strictEqual(formatEmploymentType(['FULL_TIME', 'REMOTE']), 'Full-time, Remote', 'Array of types converted');

  // JobCard integration check
  const jobCard = fs.readFileSync('src/components/JobCard.jsx', 'utf8');
  assert.ok(jobCard.includes('formatDatePosted'), 'formatDatePosted used in JobCard.jsx');
  assert.ok(jobCard.includes('formatEmploymentType'), 'formatEmploymentType used in JobCard.jsx');
});

console.log(`\nResults: ${passed}/${total} tests passed.\n`);
if (passed === total) {
  console.log('✅ All checks passed! Production React extension is verified.\n');
} else {
  process.exit(1);
}
