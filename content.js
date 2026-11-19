/**
 * JD Extractor v3.0.2 — In-Tab 3-Layer Extraction Engine
 *
 * Runs inside the webpage to extract clean job postings on-demand for the native Side Panel.
 *  - Layer 1: Dedicated LinkedIn 2-Pane & Standalone View Extractor
 *  - Layer 2: Schema.org JSON-LD (Sub-5ms instant parsing)
 *  - Layer 3: Platform-specific selectors (Workday, Indeed, Greenhouse, Lever, Ashby, Naukri, Glassdoor, Citi)
 *  - Layer 4: Smart Heuristic with search results list exclusion & noise filtering
 *  - Real-time SPA Watcher: Detects 2-pane job clicks & updates Side Panel automatically
 */

(() => {
  'use strict';

  // Prevent duplicate execution
  if (window.__JD_EXTRACTOR_ENGINE_LOADED__) return;
  window.__JD_EXTRACTOR_ENGINE_LOADED__ = true;

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. PLATFORM CONFIGURATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const PLATFORMS = [
    {
      name: 'Workday',
      match: (u) => /myworkdayjobs\.com|workday\.com/i.test(u),
      selectors: ['[data-automation-id="jobPostingDescription"]', '.css-cygeeu', '[data-automation-id="job-posting-details"]'],
      title: ['[data-automation-id="jobPostingHeader"] h2', 'h2[data-automation-id="jobPostingTitle"]', 'h1'],
      company: ['[data-automation-id="company"]'],
      location: ['[data-automation-id="locations"] dd', '[data-automation-id="location"]'],
    },
    {
      name: 'Indeed',
      match: (u) => /indeed\.com/i.test(u),
      selectors: ['#jobDescriptionText', '.jobsearch-jobDescriptionText'],
      title: ['.jobsearch-JobInfoHeader-title', 'h1'],
      company: ['[data-company-name]', '.css-1cjkto6'],
      location: ['[data-testid="job-location"]'],
    },
    {
      name: 'Greenhouse',
      match: (u) => /greenhouse\.io|boards\.greenhouse/i.test(u),
      selectors: ['#content', '#app_body', '.body'],
      title: ['.app-title', 'h1.heading'],
      company: ['.company-name', 'span.company-name'],
      location: ['.location', 'span.location'],
    },
    {
      name: 'Lever',
      match: (u) => /lever\.co|jobs\.lever/i.test(u),
      selectors: ['.section-wrapper.page-full-width', '.content', '[data-qa="job-description"]'],
      title: ['.posting-headline h2', 'h2'],
      company: ['.posting-headline .sort-by-time'],
      location: ['.location', '.posting-categories .sort-by-time .posting-category:first-child'],
    },
    {
      name: 'Ashby',
      match: (u) => /ashbyhq\.com|jobs\.ashbyhq/i.test(u),
      selectors: ['[class*="ashby-job-posting-brief-description"]', '.ashby-job-posting-description'],
      title: ['h1'],
      company: [],
      location: ['.ashby-job-posting-location'],
    },
    {
      name: 'Naukri',
      match: (u) => /naukri\.com/i.test(u),
      selectors: ['.styles_JDC__dang-inner-html__h0K4t', '.job-desc', '.dang-inner-html'],
      title: ['.styles_jd-header-title__rZwM1 h1', '.jd-header-title h1', 'h1'],
      company: ['.styles_jd-header-comp-name__MvqAI a', '.company-info a'],
      location: ['.styles_jhc__loc___Du2H', '.location'],
    },
    {
      name: 'Glassdoor',
      match: (u) => /glassdoor\.com/i.test(u),
      selectors: ['.desc', '.jobDescriptionContent', '[class*="JobDetails_jobDescription"]'],
      title: ['[data-test="job-title"]', 'h1'],
      company: ['[data-test="employer-name"]'],
      location: ['[data-test="location"]'],
    },
    {
      name: 'Citi Careers',
      match: (u) => /jobs\.citi\.com/i.test(u),
      selectors: [
        '[data-ph-at-id="job-description-text"]',
        '.job-description',
        '#job-description',
        '.jd-description',
        '.job-details',
        '.desc-content',
        'article',
        'main'
      ],
      title: ['h1.job-title', 'h1', '[data-ph-at-id="job-title-text"]'],
      company: ['Citi'],
      location: ['[data-ph-at-id="job-location-text"]', '.location', '.job-location'],
      type: ['[data-ph-at-id="job-type-text"]', '.job-type'],
      datePosted: ['[data-ph-at-id="job-post-date-text"]', '.posted-date'],
    },
  ];

  function queryText(selectors) {
    if (!selectors) return '';
    if (typeof selectors === 'string') return selectors;
    for (const sel of selectors) {
      try {
        if (!sel.startsWith('.') && !sel.startsWith('#') && !sel.startsWith('[') && !sel.startsWith('h1') && !sel.startsWith('h2') && !sel.startsWith('a') && !sel.startsWith('span') && !sel.startsWith('title')) {
          return sel;
        }
        const el = document.querySelector(sel);
        if (el && el.innerText?.trim()) return el.innerText.trim();
      } catch (_) {}
    }
    return '';
  }

  function queryEl(selectors) {
    if (!selectors) return null;
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) return el;
      } catch (_) {}
    }
    return null;
  }

  function collapseWhitespace(text) {
    return text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function htmlToMarkdown(input) {
    let root;
    if (typeof input === 'string') {
      const tmp = document.createElement('div');
      tmp.innerHTML = input;
      root = tmp;
    } else {
      root = input.cloneNode(true);
    }

    const noise = [
      'script', 'style', 'noscript', 'iframe', 'svg', 'canvas', 'video', 'audio', 'img',
      '.jobs-premium-applicant-insights',
      '[data-view-name*="premium-applicant-insights"]',
      '.jobs-similar-jobs',
      '.jobs-box__similar-jobs',
      '[class*="hiring-insights"]',
      '[class*="applicant-insights"]',
      '[class*="premium-insight"]',
      '[class*="meet-the-hiring-team"]',
      '[class*="how-you-match"]',
      '[class*="social-details"]',
      '[class*="feedback-prompt"]'
    ];
    noise.forEach((tag) => root.querySelectorAll(tag).forEach((el) => el.remove()));

    function process(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ');
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();
      const kids = Array.from(node.childNodes).map(process).join('');
      const trimmed = kids.trim();
      if (!trimmed && !['br', 'hr'].includes(tag)) return '';

      switch (tag) {
        case 'h1': return `\n\n# ${trimmed}\n\n`;
        case 'h2': return `\n\n## ${trimmed}\n\n`;
        case 'h3': return `\n\n### ${trimmed}\n\n`;
        case 'h4': case 'h5': case 'h6': return `\n\n#### ${trimmed}\n\n`;
        case 'p': return `\n\n${trimmed}\n\n`;
        case 'br': return '\n';
        case 'hr': return '\n\n---\n\n';
        case 'strong': case 'b': return `**${trimmed}**`;
        case 'em': case 'i': return `*${trimmed}*`;
        case 'li': {
          const parent = node.parentElement;
          const isOl = parent && parent.tagName.toLowerCase() === 'ol';
          const prefix = isOl ? `${Array.from(parent.children).indexOf(node) + 1}. ` : '- ';
          return `${prefix}${trimmed}\n`;
        }
        case 'ul': case 'ol': return `\n\n${kids}\n`;
        case 'nav': case 'header': case 'footer': case 'aside': case 'form': case 'button':
          return '';
        default:
          return kids;
      }
    }

    let md = collapseWhitespace(process(root));
    md = md
      .replace(/##\s*Unlock hiring insights[\s\S]*$/i, '')
      .replace(/Reactivate Premium[\s\S]*$/i, '')
      .replace(/##\s*People you can reach out to[\s\S]*$/i, '')
      .replace(/##\s*Meet the hiring team[\s\S]*$/i, '')
      .trim();
    return md;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. EXTRACTION ENGINES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Dedicated LinkedIn Extractor
   * Correctly isolates the right-hand details pane in 2-pane search results
   * (e.g. linkedin.com/jobs/search-results/?currentJobId=...) as well as standalone view (/jobs/view/...)
   */
  function extractLinkedIn() {
    // 1. Identify the Job Details container (right-hand rail in 2-pane view, or main job view)
    const detailContainer = queryEl([
      '.scaffold-layout__detail',
      '.jobs-search__job-details--container',
      '.jobs-search-two-pane__details',
      '.jobs-details__main-content',
      '.job-view-layout',
      '.jobs-search__right-rail',
      '[data-job-id].jobs-search__job-details',
      'main .scaffold-layout__detail',
      'section[class*="detail"]'
    ]) || document;

    // 2. Locate the full job description element using multi-tier strategy
    let descEl = null;

    // Strategy A: Targeted class selectors inside the detail container
    const descSelectors = [
      '.show-more-less-html__markup',
      '.jobs-description__content',
      '.jobs-description-content__text',
      '.jobs-box__html-content',
      'article.jobs-description__container',
      '.jobs-description',
      '.description__text',
      '[data-job-details-html]',
      '[class*="job-details-description"]',
      '[class*="jobs-description"]'
    ];

    for (const sel of descSelectors) {
      const el = detailContainer.querySelector(sel);
      if (el) {
        const text = (el.innerText || el.textContent || '').trim();
        if (text.length > 100) {
          descEl = el;
          break;
        }
      }
    }

    // Strategy B: #job-details element inspection (handles when #job-details is a header <h2> or a container <div>)
    if (!descEl) {
      const jobDetailsEl = detailContainer.querySelector('#job-details') || document.querySelector('#job-details');
      if (jobDetailsEl) {
        const text = (jobDetailsEl.innerText || jobDetailsEl.textContent || '').trim();
        if (text.length > 100) {
          descEl = jobDetailsEl;
        } else {
          // If #job-details is a header or marker (e.g. <h2>About the job</h2>), climb up to find enclosing content section
          let curr = jobDetailsEl.parentElement;
          while (curr && curr !== detailContainer && curr.tagName !== 'MAIN' && curr.tagName !== 'BODY') {
            if (curr.closest('.jobs-search-results-list, .scaffold-layout__list')) break;
            const cText = (curr.innerText || curr.textContent || '').trim();
            if (cText.length > 100) {
              descEl = curr;
              break;
            }
            curr = curr.parentElement;
          }
          if (!descEl && jobDetailsEl.nextElementSibling) {
            const nextText = (jobDetailsEl.nextElementSibling.innerText || jobDetailsEl.nextElementSibling.textContent || '').trim();
            if (nextText.length > 100) {
              descEl = jobDetailsEl.nextElementSibling;
            }
          }
        }
      }
    }

    // Strategy C: Search for "About the job" heading within detail container or document
    if (!descEl) {
      const headings = Array.from((detailContainer || document).querySelectorAll('h1, h2, h3, h4, strong, div, span'));
      for (const h of headings) {
        const hText = (h.innerText || h.textContent || '').trim();
        if (/^About the job$/i.test(hText) || /^Job Description$/i.test(hText)) {
          let curr = h.parentElement;
          while (curr && curr !== detailContainer && curr.tagName !== 'MAIN' && curr.tagName !== 'BODY') {
            if (curr.closest('.jobs-search-results-list, .scaffold-layout__list')) break;
            const cText = (curr.innerText || curr.textContent || '').trim();
            if (cText.length > 100) {
              descEl = curr;
              break;
            }
            curr = curr.parentElement;
          }
          if (descEl) break;
          if (h.nextElementSibling) {
            const nextText = (h.nextElementSibling.innerText || h.nextElementSibling.textContent || '').trim();
            if (nextText.length > 100) {
              descEl = h.nextElementSibling;
              break;
            }
          }
        }
      }
    }

    // Strategy D: Any <article> in the right rail container
    if (!descEl && detailContainer !== document) {
      const article = detailContainer.querySelector('article');
      if (article && (article.innerText || article.textContent || '').trim().length > 100) {
        descEl = article;
      }
    }

    // Strategy E: Any substantive container in right rail that isn't the top card or list
    if (!descEl && detailContainer !== document) {
      const candidates = Array.from(detailContainer.querySelectorAll('div, section'));
      for (const c of candidates) {
        if (c.closest('.job-details-jobs-unified-top-card, .jobs-unified-top-card, .jobs-search-results-list, .scaffold-layout__list')) continue;
        const cText = (c.innerText || c.textContent || '').trim();
        if (cText.length > 150) {
          descEl = c;
          break;
        }
      }
    }

    if (!descEl) {
      // Check if LinkedIn is actively loading the job details (e.g. artdeco-skeleton or loading placeholders)
      const isSkeletonLoading = detailContainer.querySelector('.artdeco-skeleton, .jobs-search__job-details--loading, [class*="skeleton"], .ghost-placeholder, .is-loading') !== null;
      const hasActiveCard = document.querySelector('.jobs-search-results-list__list-item--active, [class*="selected"], [class*="is-active"]') !== null;
      if (isSkeletonLoading || hasActiveCard) {
        return { loading: true };
      }
      return null;
    }

    const desc = htmlToMarkdown(descEl);
    if (!desc || desc.length < 40) {
      return { loading: true };
    }

    // 3. Extract Job Title
    let title = '';
    const titleSelectors = [
      '.job-details-jobs-unified-top-card__job-title h1',
      '.job-details-jobs-unified-top-card__job-title a',
      '.job-details-jobs-unified-top-card__job-title',
      '.jobs-unified-top-card__job-title h1',
      '.jobs-unified-top-card__job-title',
      '.top-card-layout__title',
      'h1.t-24',
      'h1.t-20',
      'h1'
    ];
    for (const sel of titleSelectors) {
      const el = detailContainer.querySelector(sel);
      if (el && el.innerText?.trim()) {
        title = el.innerText.trim();
        break;
      }
    }
    // Fallback: check active card in left list
    if (!title) {
      const activeCard = document.querySelector('.jobs-search-results-list__list-item--active, [class*="selected"], [class*="is-active"]');
      if (activeCard) {
        const titleEl = activeCard.querySelector('.job-card-list__title, [class*="job-title"], strong');
        if (titleEl && titleEl.innerText?.trim()) title = titleEl.innerText.trim();
      }
    }
    if (!title) {
      title = document.title
        .replace(/\s*[\|–—\-]\s*(LinkedIn|Job|Careers).*$/i, '')
        .replace(/\s*[\|–—\-]\s*.{1,30}$/, '')
        .trim();
    }

    // 4. Extract Company Name
    let company = '';
    const compSelectors = [
      '.job-details-jobs-unified-top-card__company-name a',
      '.job-details-jobs-unified-top-card__company-name',
      '.job-details-jobs-unified-top-card__subtitle a',
      '.jobs-unified-top-card__company-name a',
      '.jobs-unified-top-card__company-name',
      'a[href*="/company/"]',
      '.topcard__org-name-link',
      '[class*="company-name"] a',
      '[class*="company-name"]'
    ];
    for (const sel of compSelectors) {
      const el = detailContainer.querySelector(sel);
      if (el && el.innerText?.trim()) {
        const raw = el.innerText.trim();
        if (raw.length > 0 && raw.length < 80) {
          company = raw.replace(/^[A-Z]\.\s+/, '').replace(/\s+/g, ' ').trim();
          break;
        }
      }
    }
    // Fallback: check active card in left list
    if (!company) {
      const activeCard = document.querySelector('.jobs-search-results-list__list-item--active, [class*="selected"], [class*="is-active"], .job-card-container--clickable');
      if (activeCard) {
        const compEl = activeCard.querySelector('.job-card-container__primary-description, [class*="company-name"], a[href*="/company/"]');
        if (compEl && compEl.innerText?.trim()) {
          company = compEl.innerText.trim().replace(/^[A-Z]\.\s+/, '').replace(/\s+/g, ' ').trim();
        }
      }
    }

    // 5. Extract Location and Date Posted
    let location = '';
    let datePosted = '';
    const primaryDesc = detailContainer.querySelector(
      '.job-details-jobs-unified-top-card__primary-description-container, .job-details-jobs-unified-top-card__primary-description, [class*="primary-description"]'
    );
    if (primaryDesc) {
      const text = primaryDesc.innerText || '';
      const parts = text.split(/[·•\n]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length > 0 && !/ago|reposted|posted|applicant|applied|people|clicked/i.test(parts[0])) {
        location = parts[0];
      }
      for (const p of parts) {
        if (/(\d+\s+(day|week|month|hour|minute)s?\s+ago|posted|reposted)/i.test(p)) {
          datePosted = p.replace(/^(reposted|posted)\s*/i, '').trim();
          break;
        }
      }
    }

    if (!location) {
      const locEl = detailContainer.querySelector(
        '.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .topcard__flavor--bullet'
      );
      if (locEl) {
        location = locEl.innerText.trim().split(/[·•\n]+/)[0].trim();
      }
    }
    // Fallback: check active card in left list
    if (!location) {
      const activeCard = document.querySelector('.jobs-search-results-list__list-item--active, [class*="selected"], [class*="is-active"]');
      if (activeCard) {
        const locEl = activeCard.querySelector('.job-card-container__metadata-item, [class*="metadata-item"]');
        if (locEl && locEl.innerText?.trim()) {
          location = locEl.innerText.trim().split('\n')[0].trim();
        }
      }
    }

    // 6. Extract Workplace / Employment Type & Salary
    let type = '';
    let salary = '';
    const insightEls = detailContainer.querySelectorAll(
      '.job-details-jobs-unified-top-card__job-insight, .jobs-unified-top-card__job-insight, [class*="job-insight"], button.job-details-preferences-and-skills__pill, .job-details-preferences-and-skills button, .ui-label'
    );
    const types = [];
    insightEls.forEach((el) => {
      const txt = (el.innerText || '').replace(/^[✓✔\s]+/, '').trim();
      if (!txt) return;

      if (/[\$€£₹]\s*\d|(\d+K|\d+,\d+)\s*(\/|-|to|a year|yr|mo|hr)/i.test(txt)) {
        if (!salary) salary = txt.split('\n')[0].trim();
        return;
      }

      if (/hybrid|remote|on-site|full-time|part-time|contract|temporary|internship/i.test(txt)) {
        const parts = txt.split(/[·•\n]+/);
        for (const p of parts) {
          const c = p.trim();
          if (/^(hybrid|remote|on-site|full-time|part-time|contract|temporary|internship)$/i.test(c)) {
            if (!types.includes(c)) types.push(c);
          }
        }
      }
    });

    if (types.length > 0) {
      type = types.join(' · ');
    }

    return {
      title,
      company,
      location,
      type,
      salary,
      datePosted,
      description: desc,
      method: 'LinkedIn',
    };
  }

  function extractJsonLd() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        let data = JSON.parse(script.textContent);
        if (data['@graph'] && Array.isArray(data['@graph'])) data = data['@graph'];
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          const job = findJobPosting(item);
          if (job) return parseJobPosting(job);
        }
      } catch (_) {}
    }
    return null;
  }

  function findJobPosting(obj, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 4) return null;
    if (obj['@type'] === 'JobPosting') return obj;
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          const f = findJobPosting(item, depth + 1);
          if (f) return f;
        }
      } else if (typeof obj[key] === 'object') {
        const f = findJobPosting(obj[key], depth + 1);
        if (f) return f;
      }
    }
    return null;
  }

  function parseJobPosting(job) {
    let title = job.title || '';
    const pageH1 = document.querySelector('h1')?.innerText?.trim();
    if (pageH1 && (title.length > 50 && pageH1.length < title.length && pageH1.length > 5)) {
      title = pageH1;
    } else if (title && /^[A-Z0-9_\-]{4,35}\s*[-–—:]\s*/.test(title)) {
      title = title.replace(/^[A-Z0-9_\-]{4,35}\s*[-–—:]\s*/, '').trim();
    }
    const company = job.hiringOrganization?.name || job.hiringOrganization?.legalName || (typeof job.hiringOrganization === 'string' ? job.hiringOrganization : '');
    let location = '';
    if (job.jobLocation) {
      const locs = Array.isArray(job.jobLocation) ? job.jobLocation : [job.jobLocation];
      location = locs.map((l) => l.address ? [l.address.addressLocality, l.address.addressRegion, l.address.addressCountry].filter(Boolean).join(', ') : (l.name || '')).filter(Boolean).join(' | ');
    }
    if (job.jobLocationType === 'TELECOMMUTE') location = location ? `${location} (Remote)` : 'Remote';

    const desc = htmlToMarkdown(job.description || '');
    if (!desc || desc.length < 30) return null;

    let salary = '';
    const s = job.baseSalary || job.estimatedSalary;
    if (s && s.value) {
      const v = s.value;
      let cur = s.currency || '';
      if (cur === 'USD') cur = '$';
      else if (cur === 'EUR') cur = '€';
      else if (cur === 'GBP') cur = '£';
      
      const unit = v.unitText ? (
        /year|annual/i.test(v.unitText) ? '/yr' :
        /month/i.test(v.unitText) ? '/mo' :
        /hour/i.test(v.unitText) ? '/hr' :
        `/${v.unitText.toLowerCase()}`
      ) : '';

      salary = (v.minValue && v.maxValue) 
        ? `${cur} ${Number(v.minValue).toLocaleString()} - ${Number(v.maxValue).toLocaleString()}${unit}` 
        : `${cur} ${v.value || v.minValue || ''}${unit}`;
    }

    // Format clean employment type
    const rawType = Array.isArray(job.employmentType) ? job.employmentType.join(', ') : (job.employmentType || '');
    const cleanType = rawType.split(/[,|/]+/).map((t) => {
      const k = t.trim().toLowerCase().replace(/[\s-]+/g, '_');
      if (k === 'full_time' || k === 'fulltime') return 'Full-time';
      if (k === 'part_time' || k === 'parttime') return 'Part-time';
      if (k === 'contract' || k === 'contractor') return 'Contract';
      if (k === 'intern' || k === 'internship') return 'Internship';
      if (k === 'temporary' || k === 'temp') return 'Temporary';
      if (k === 'remote' || k === 'telecommute') return 'Remote';
      if (k === 'hybrid') return 'Hybrid';
      if (k === 'on_site' || k === 'onsite') return 'On-site';
      return t.trim().replace(/_/g, ' ').replace(/\b([a-z])/gi, (_, c) => c.toUpperCase());
    }).filter(Boolean).join(', ');

    // Format clean date posted
    let cleanDate = (job.datePosted || '').trim();
    if (cleanDate && !/ago\b|today|yesterday/i.test(cleanDate)) {
      const parsed = new Date(cleanDate);
      if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        if (year >= 2000 && year <= 2099) {
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          cleanDate = `${months[parsed.getMonth()]} ${parsed.getDate()}, ${year}`;
        }
      }
    }

    return {
      title,
      company,
      location,
      type: cleanType || rawType,
      salary: salary.trim(),
      datePosted: cleanDate,
      description: desc,
      method: 'JSON-LD',
    };
  }

  function extractByPlatform() {
    const url = window.location.href;
    for (const p of PLATFORMS) {
      if (!p.match(url)) continue;
      const el = queryEl(p.selectors);
      if (!el) continue;
      const desc = htmlToMarkdown(el);
      if (!desc || desc.length < 30) continue;
      return {
        title: queryText(p.title),
        company: queryText(p.company),
        location: queryText(p.location),
        type: queryText(p.type),
        salary: queryText(p.salary),
        datePosted: queryText(p.datePosted),
        description: desc,
        method: `Platform (${p.name})`,
      };
    }
    return null;
  }

  // Known non-career web apps / domains that should never be heuristically parsed as JDs
  const NON_JOB_DOMAINS = [
    // AI Chat & LLM Assistants
    /gemini\.google\.com/i,
    /chatgpt\.com|chat\.openai\.com|platform\.openai\.com/i,
    /claude\.ai/i,
    /perplexity\.ai/i,
    /copilot\.microsoft\.com/i,
    /poe\.com/i,
    /chat\.mistral\.ai/i,
    /chat\.deepseek\.com/i,
    /huggingface\.co/i,
    /v0\.dev/i,
    /character\.ai/i,

    // Webmail & Communication
    /mail\.google\.com/i,
    /outlook\.(live|office)\.com/i,
    /mail\.yahoo\.com/i,
    /slack\.com/i,
    /discord\.com/i,
    /teams\.microsoft\.com/i,
    /web\.whatsapp\.com/i,
    /telegram\.org/i,

    // Productivity, Docs & Code Hosting
    /docs\.google\.com|drive\.google\.com|calendar\.google\.com/i,
    /notion\.so/i,
    /figma\.com/i,
    /canva\.com/i,
    /miro\.com/i,
    /trello\.com/i,
    /github\.com\/(?!.*\/careers|.*\/jobs)/i,
    /gitlab\.com\/(?!.*\/careers|.*\/jobs)/i,
    /stackoverflow\.com\/(?!.*\/jobs)/i,

    // Media & Social Platforms
    /youtube\.com/i,
    /netflix\.com/i,
    /spotify\.com/i,
    /twitch\.tv/i,
    /twitter\.com|x\.com/i,
    /facebook\.com|instagram\.com/i,
    /reddit\.com/i,
    /tiktok\.com/i,

    // Search, Knowledge & General Shopping
    /amazon\.(com|in|co\.uk|de|fr|ca|co\.jp)\/(?!.*\/jobs|.*\/careers)/i,
    /google\.(com|co\.[a-z]+)\/(search|drive|docs|maps|intl|preferences|flights)/i,
    /bing\.com/i,
    /duckduckgo\.com/i,
    /wikipedia\.org/i
  ];

  function isNonJobDomain(url) {
    return NON_JOB_DOMAINS.some((pattern) => pattern.test(url));
  }

  // Strong job posting signals required for heuristic extraction
  const JOB_HEURISTIC_SIGNALS = [
    /\b(responsibilities|duties|what you('ll| will) do|role overview|about the (role|position|job))\b/i,
    /\b(qualifications|requirements|what you('ll| will) bring|must have|skills required|experience required|who you are|basic qualifications)\b/i,
    /\b(apply now|how to apply|apply for this (job|role|position)|submit application|easy apply)\b/i,
    /\b(benefits|what we offer|compensation|perks)\b/i,
    /\b(job description|position summary|job summary|job overview)\b/i,
    /\b(full[\s-]time|part[\s-]time|hybrid|remote|years of experience)\b/i
  ];

  function countJobSignals(text) {
    let count = 0;
    for (const pattern of JOB_HEURISTIC_SIGNALS) {
      if (pattern.test(text)) count++;
    }
    return count;
  }

  function extractByHeuristic() {
    const url = window.location.href;
    if (isNonJobDomain(url)) return null;

    const hasCareerUrl = /(careers?|jobs?|positions?|openings?|roles?|vacanc(y|ies)|work-with-us|join-us)/i.test(url);

    // Search candidates in live DOM to ensure innerText layout calculations are valid
    const candidates = Array.from(document.querySelectorAll('main, article, [role="main"], section, div'));
    let best = null;
    let maxScore = 0;
    let maxLen = 0;

    candidates.forEach((el) => {
      // Exclude navigation, sidebars, search lists, headers, footers
      if (el.closest('nav, header, footer, aside, .jobs-search-results-list, .scaffold-layout__list, [role="navigation"]')) {
        return;
      }
      // Exclude chat message bubbles, AI prompt conversations, and forum comments
      if (el.closest('[class*="chat"], [class*="message"], [class*="conversation"], [data-message-author-role], [class*="model-response"], [class*="user-prompt"], [class*="response-container"], [class*="streaming-message"]')) {
        return;
      }
      const cls = ((el.className || '') + ' ' + (el.id || '')).toLowerCase();
      if (/nav|header|footer|sidebar|cookie|banner|toast|notification|alert|modal|dialog|results-list|search-results|scaffold-layout__list/i.test(cls)) {
        return;
      }
      const text = (el.innerText || '').trim();
      if (text.length < 150 || text.length > 80000) return;

      const signals = countJobSignals(text);
      // For general non-career URLs, require at least 3 signals and an apply button
      const minSignals = hasCareerUrl ? 2 : 3;
      if (signals >= minSignals) {
        if (!hasCareerUrl) {
          const hasApplyBtn = el.querySelector('a[href*="apply"], button, [role="button"]') &&
            /apply|submit application/i.test(el.innerText);
          if (!hasApplyBtn) return;
        }

        if (signals > maxScore || (signals === maxScore && text.length > maxLen)) {
          maxScore = signals;
          maxLen = text.length;
          best = el;
        }
      }
    });

    if (!best || maxScore < 2) return null;
    return {
      title: document.title.replace(/\s*[\|–—\-]\s*.{1,30}$/, '').trim(),
      company: '',
      location: '',
      type: '',
      salary: '',
      datePosted: '',
      description: htmlToMarkdown(best),
      method: 'Smart Heuristic',
    };
  }

  async function executeExtraction() {
    const t0 = performance.now();
    let res = null;

    // Immediately reject known non-job web apps (Gmail, GitHub repos, YouTube, etc.)
    if (isNonJobDomain(window.location.href)) {
      return {
        error: true,
        message: 'No job description found on this page. Make sure you are on a specific job posting page.',
        time: Math.round(performance.now() - t0),
      };
    }

    // On LinkedIn, always use dedicated extractor so the right-hand details rail is captured
    // and NEVER fall back to generic heuristic that could scrape the search results list
    if (/linkedin\.com\/jobs/i.test(window.location.href)) {
      // 1. Try immediate extraction
      res = extractLinkedIn();
      if (res && !res.loading && res.description) {
        res.time = Math.round(performance.now() - t0);
        return res;
      }

      // 2. If LinkedIn is still rendering its details (AJAX in flight after card click),
      // poll every 120ms for up to 1.8 seconds (15 attempts) so it never fails prematurely
      for (let attempt = 0; attempt < 15; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 120));
        res = extractLinkedIn();
        if (res && !res.loading && res.description) {
          res.time = Math.round(performance.now() - t0);
          return res;
        }
      }

      if (res && res.loading) {
        return res;
      }

      return {
        error: true,
        message: 'Please click any job card on the left list to extract its full description.',
        time: Math.round(performance.now() - t0),
      };
    }

    if (!res) {
      res = extractJsonLd() || extractByPlatform() || extractByHeuristic();
    }

    if (res) {
      res.time = Math.round(performance.now() - t0);
      return res;
    }

    return {
      error: true,
      message: 'No job description found on this page. Make sure you are on a specific job posting page.',
      time: Math.round(performance.now() - t0),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. RUNTIME COMMUNICATION & SPA NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════

  function isContextValid() {
    try {
      return Boolean(typeof chrome !== 'undefined' && chrome?.runtime && !!chrome.runtime.id);
    } catch (_) {
      return false;
    }
  }

  function safeSendMessage(message) {
    if (!isContextValid()) return;
    try {
      const p = chrome.runtime.sendMessage(message);
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    } catch (_) {
      // Extension context invalidated — gracefully ignore
    }
  }

  // Listen for extraction requests from the Side Panel
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    try {
      chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
        if (!isContextValid()) return false;
        if (req.action === 'extract_jd') {
          executeExtraction()
            .then((data) => {
              if (isContextValid()) sendResponse(data);
            })
            .catch((err) => {
              if (isContextValid()) sendResponse({ error: true, message: err?.message || 'Extraction failed' });
            });
          return true; // Keep message channel open for async response
        }
        return true;
      });
    } catch (_) {}
  }

  // SPA navigation watcher with debouncing (LinkedIn, Workday, Indeed updates within the same page)
  let lastUrl = window.location.href;
  let spaTimer = null;

  function triggerSpaUpdate(delay = 300) {
    if (!isContextValid()) return;
    clearTimeout(spaTimer);
    spaTimer = setTimeout(() => {
      if (!isContextValid()) return;
      lastUrl = window.location.href;
      safeSendMessage({ action: 'spa_url_changed', url: lastUrl });
    }, delay);
  }

  // Hook history pushState & replaceState for immediate SPA route detection
  try {
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      const res = origPushState.apply(this, args);
      if (isContextValid()) triggerSpaUpdate(300);
      return res;
    };

    const origReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      const res = origReplaceState.apply(this, args);
      if (isContextValid()) triggerSpaUpdate(300);
      return res;
    };

    window.addEventListener('popstate', () => {
      if (isContextValid()) triggerSpaUpdate(300);
    });
  } catch (_) {}

  // Periodic fallback check for URL parameter changes (e.g. currentJobId=...)
  // Automatically self-terminates when extension is reloaded/invalidated
  const spaInterval = setInterval(() => {
    if (!isContextValid()) {
      clearInterval(spaInterval);
      return;
    }
    if (window.location.href !== lastUrl) {
      triggerSpaUpdate(150);
    }
  }, 500);

  // Click listener for job listings in 2-pane search results
  // Immediately notifies Side Panel when user clicks a different job card in the list
  document.addEventListener('click', (e) => {
    if (!isContextValid()) return;
    const jobItem = e.target.closest(
      '.jobs-search-results-list__list-item, [data-occludable-job-id], [data-job-id], .job-card-container, .jobs-search-results__list-item'
    );
    if (jobItem) {
      safeSendMessage({ action: 'job_selection_started' });
      // Allow LinkedIn 250ms to start updating, then trigger extraction
      triggerSpaUpdate(250);
    }
  }, { passive: true });

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. REAL-TIME DOM MUTATION OBSERVER (LinkedIn Right Rail)
  // ═══════════════════════════════════════════════════════════════════════════

  let lastExtractedJobKey = null;
  let observerDebounce = null;

  function initLinkedInDetailObserver() {
    if (!/linkedin\.com\/jobs/i.test(window.location.href)) return;

    const target = document.querySelector('.scaffold-layout__detail') || document.querySelector('main') || document.body;
    if (!target) return;

    const observer = new MutationObserver(() => {
      if (!isContextValid()) {
        observer.disconnect();
        return;
      }
      clearTimeout(observerDebounce);
      observerDebounce = setTimeout(() => {
        if (!isContextValid()) return;
        const res = extractLinkedIn();
        if (res && !res.loading && res.description && res.title) {
          const key = `${res.title}__${res.company || ''}`;
          if (key !== lastExtractedJobKey) {
            lastExtractedJobKey = key;
            res.time = 8;
            safeSendMessage({ action: 'auto_extraction_complete', data: res });
          }
        }
      }, 180);
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  // Initialize observer shortly after page load
  if (/linkedin\.com\/jobs/i.test(window.location.href)) {
    setTimeout(initLinkedInDetailObserver, 600);
  }

})();
