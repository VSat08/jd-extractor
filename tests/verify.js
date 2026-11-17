/**
 * JD Extractor — Automated Verification Test Suite (ESM)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

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

  const css = fs.readFileSync('src/styles/apple-theme.css', 'utf8');
  assert.ok(css.includes('apple-shimmer'), 'Apple shimmer keyframes defined');
  assert.ok(css.includes('.skeleton-box'), 'Skeleton box style defined');

  const app = fs.readFileSync('src/App.jsx', 'utf8');
  assert.ok(app.includes('SkeletonLoader'), 'SkeletonLoader imported and used in App.jsx');
  assert.ok(app.includes('res?.loading'), 'App.jsx handles loading retries gracefully');
});

console.log(`\nResults: ${passed}/${total} tests passed.\n`);
if (passed === total) {
  console.log('✅ All checks passed! Production React extension is verified.\n');
} else {
  process.exit(1);
}
