/**
 * Apple-grade Client-Side Resume Parser
 * Parses raw text extracted from PDF or text resumes into a structured profile:
 * - Candidate Name
 * - Contact info (Email, Phone, Links)
 * - Years of Professional Experience
 * - Recognized Skills (via skillTaxonomy)
 * - Roles & Job Titles
 * - Education
 */

import { extractSkillsFromText } from './skillTaxonomy.js';

// Recognized roles for resume title extraction
const ROLE_PATTERNS = [
  /\bfull[- ]?stack\s+(?:developer|engineer|software engineer)\b/i,
  /\bfrontend\s+(?:developer|engineer|software engineer|web developer)\b/i,
  /\bbackend\s+(?:developer|engineer|software engineer)\b/i,
  /\bsoftware\s+(?:engineer|developer|architect)\b/i,
  /\bdevsecops\s+(?:engineer|architect|lead)\b/i,
  /\bdevops\s+(?:engineer|architect|lead)\b/i,
  /\bcloud\s+(?:engineer|architect)\b/i,
  /\bsite\s+reliability\s+engineer|sre\b/i,
  /\bdata\s+(?:engineer|scientist|analyst)\b/i,
  /\bmachine\s+learning\s+(?:engineer|scientist)\b/i,
  /\bai\s+(?:engineer|researcher)\b/i,
  /\bmobile\s+(?:developer|engineer)\b/i,
  /\bios\s+(?:developer|engineer)\b/i,
  /\bandroid\s+(?:developer|engineer)\b/i,
  /\bqa\s+(?:engineer|lead|tester)|quality\s+assurance\b/i,
  /\bproduct\s+manager|technical\s+product\s+manager|product\s+owner\b/i,
  /\bengineering\s+manager|tech\s+lead|lead\s+developer|staff\s+engineer\b/i,
  /\bui[\/-]ux\s+(?:designer|developer)|product\s+designer\b/i,
];

// Degree patterns with strict word boundaries to avoid false positives (e.g. hibernate -> bernate, or word 'be')
const EDUCATION_PATTERNS = [
  /\b(?:bachelor(?:s|'s)?(?:\s+degree)?|b\.?tech|btech|b\.e\.|b\.eng|bachelor\s+of\s+engineering|b\.s\.|bachelor\s+of\s+science|b\.?sc|b\.?c\.?a)\b(?:\s+(?:of|in)\s+([^\r\n,;|]{2,40}))?/i,
  /\b(?:master(?:s|'s)?(?:\s+degree)?|m\.?tech|mtech|m\.s\.|master\s+of\s+science|m\.?sc|m\.?b\.?a|m\.?c\.?a)\b(?:\s+(?:of|in)\s+([^\r\n,;|]{2,40}))?/i,
  /\b(?:associate(?:s|'s)?(?:\s+degree)?|a\.s\.|a\.a\.)\b(?:\s*(?:of|in|:)\s*([^\r\n,;|]{2,40}))?/i,
  /\b(?:ph\.?d|doctorate)\b(?:\s+(?:in)\s+([^\r\n,;|]{2,40}))?/i,
  /\b(?:diploma|higher\s+secondary)\b(?:\s+(?:in)\s+([^\r\n,;|]{2,40}))?/i,
  /\b(computer\s+science|information\s+technology|software\s+engineering|electrical\s+engineering|data\s+science|business\s+administration)\b/i,
];

const MONTH_MAP = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

/**
 * Parses date tokens into { year, month } numbers
 */
function parseDateToken(token, currentYear, currentMonth) {
  if (!token) return null;
  const clean = token.trim().toLowerCase().replace(/[.,]/g, '');

  if (/^(?:present|current|now|ongoing)$/i.test(clean)) {
    return { year: currentYear, month: currentMonth };
  }

  // Format 1: MM/YYYY or MM-YYYY
  const slashMatch = clean.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const m = parseInt(slashMatch[1], 10);
    const y = parseInt(slashMatch[2], 10);
    if (m >= 1 && m <= 12 && y >= 1970 && y <= currentYear + 1) {
      return { year: y, month: m };
    }
  }

  // Format 2: MonthName YYYY (e.g. "July 2009", "Aug 2008", "May 2025")
  const wordMatch = clean.match(/^([a-z]{3,9})\s+(\d{4})$/);
  if (wordMatch) {
    const mName = wordMatch[1];
    const y = parseInt(wordMatch[2], 10);
    if (MONTH_MAP[mName] && y >= 1970 && y <= currentYear + 1) {
      return { year: y, month: MONTH_MAP[mName] };
    }
  }

  // Format 3: YYYY only
  const yearMatch = clean.match(/^(\d{4})$/);
  if (yearMatch) {
    const y = parseInt(yearMatch[1], 10);
    if (y >= 1970 && y <= currentYear + 1) {
      return { year: y, month: 6 }; // Default to mid-year
    }
  }

  return null;
}

/**
 * Clean and extract candidate's name from header lines
 */
function extractCandidateName(text) {
  if (!text) return 'Candidate Profile';

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    let line = lines[i];
    // Strip trailing job titles like "| Software Engineer" or "- Full Stack Developer" or bullet marks
    line = line.split(/[-|•–—\/▪■\t]/)[0].trim();

    // Skip if line has an email, phone, web link, or common resume titles
    if (/@/.test(line) || /http/i.test(line) || /\.(com|org|net|io|in)\b/i.test(line)) continue;
    if (/(?:curriculum\s+vitae|resume|portfolio|contact|summary|experience|education|skills)/i.test(line)) continue;
    if (/\d{3,}/.test(line)) continue;

    // Check if line looks like a person's name (2-4 words, alphabet letters only)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      if (words.every((w) => /^[a-zA-Z.'-]+$/.test(w) && w.length >= 2)) {
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }
  }

  return 'Candidate Profile';
}

/**
 * Extracts candidate contact details
 */
function extractContactDetails(text) {
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : null;

  // Supports US formats (617-555-1234, (617) 555-1234), international numbers (+91 95080 81743, +91-9508081743, +44 7911 123456), etc.
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|(?:\+\d{1,3}[-.\s]?)?\b\d{5}[-.\s]?\d{5}\b|(?:\+\d{1,3}[-.\s]?)?\b\d{4}[-.\s]?\d{6}\b/);
  const phone = phoneMatch ? phoneMatch[0].trim() : null;

  const links = [];
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) links.push(`github.com/${githubMatch[1]}`);

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) links.push(`linkedin.com/in/${linkedinMatch[1]}`);

  const behanceMatch = text.match(/(?:https?:\/\/)?(?:www\.)?behance\.net\/([a-zA-Z0-9_-]+)/i);
  if (behanceMatch) links.push(`behance.net/${behanceMatch[1]}`);

  const dribbbleMatch = text.match(/(?:https?:\/\/)?(?:www\.)?dribbble\.com\/([a-zA-Z0-9_-]+)/i);
  if (dribbbleMatch) links.push(`dribbble.com/${dribbbleMatch[1]}`);

  const leetcodeMatch = text.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/i);
  if (leetcodeMatch) links.push(`leetcode.com/u/${leetcodeMatch[1]}`);

  return { email, phone, links };
}

/**
 * Computes or extracts years of professional experience
 */
function extractExperienceYears(text) {
  if (!text) return 0;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Step 1: Strip Education Section so education graduation years don't inflate experience
  let workText = text;
  const eduStart = text.search(/\b(?:education|academics|qualifications|academic background)\b/i);
  if (eduStart !== -1) {
    const afterEdu = text.slice(eduStart);
    const nextSecMatch = afterEdu.slice(20).search(/\b(?:experience|work history|professional experience|employment|projects|skills|technical skills)\b/i);
    if (nextSecMatch !== -1) {
      workText = text.slice(0, eduStart) + afterEdu.slice(20 + nextSecMatch);
    } else {
      workText = text.slice(0, eduStart);
    }
  }

  // Step 2: Direct explicit mention (e.g. "4+ years of experience", "5.5 years experience")
  const explicitRegex = /(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)(?:\s+of)?\s+(?:experience|exp|hands-on|industry|professional)/i;
  const explicitMatch = workText.match(explicitRegex);
  if (explicitMatch) {
    const val = parseFloat(explicitMatch[1]);
    if (val >= 0.5 && val <= 35) {
      return Math.round(val * 10) / 10;
    }
  }

  // Step 3: Date range pattern supporting MM/YYYY, Month YYYY, and YYYY
  // Matches: "01/2015-06/2017", "July 2009 - present", "Jan. 2006 – Feb. 2009", "2022 - 2024", "May 2025 – Present"
  const dateRangeRegex = /(?:(\d{1,2}[\/\-]\d{4}|[a-zA-Z]{3,9}\.?\s+\d{4}|\b20\d\d\b|\b19\d\d\b))\s*(?:[-–—to]+|\s+to\s+)\s*(\d{1,2}[\/\-]\d{4}|[a-zA-Z]{3,9}\.?\s+\d{4}|\b20\d\d\b|\b19\d\d\b|present|current|now)/gi;

  let match;
  const intervals = [];

  while ((match = dateRangeRegex.exec(workText)) !== null) {
    const startObj = parseDateToken(match[1], currentYear, currentMonth);
    const endObj = parseDateToken(match[2], currentYear, currentMonth);

    if (startObj && endObj) {
      const startMonths = startObj.year * 12 + startObj.month;
      const endMonths = endObj.year * 12 + endObj.month;

      if (endMonths >= startMonths && startMonths >= 1970 * 12) {
        intervals.push([startMonths, endMonths]);
      }
    }
  }

  if (intervals.length > 0) {
    intervals.sort((a, b) => a[0] - b[0]);
    let merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const curr = intervals[i];
      if (curr[0] <= last[1]) {
        last[1] = Math.max(last[1], curr[1]);
      } else {
        merged.push(curr);
      }
    }

    const totalMonths = merged.reduce((acc, [s, e]) => acc + (e - s), 0);
    const totalYears = Math.round((totalMonths / 12) * 10) / 10;
    if (totalYears > 0) {
      return Math.min(30, Math.max(0.5, totalYears));
    }
  }

  // Step 4: Fallback: Secondary mention e.g. "Over 3 years"
  const secondary = workText.match(/(?:over|more than|around|approx(?:\.)?)\s*(\d+)\s*(?:years|yrs)/i);
  if (secondary) {
    const val = parseInt(secondary[1], 10);
    if (val > 0 && val <= 30) return val;
  }

  return 0;
}

/**
 * Extracts candidate target roles from resume text
 */
function extractRoles(text) {
  const roles = new Set();
  for (const pattern of ROLE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const formatted = match[0]
        .split(/[\s-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      roles.add(formatted);
    }
  }
  return Array.from(roles);
}

/**
 * Extracts candidate education
 */
function extractEducation(text) {
  // First, look within lines near "education" or "academic"
  const lines = text.split(/\r?\n/);
  let educationSection = '';
  let inEduSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^(?:education|academics|qualifications|academic background)\b/i.test(line)) {
      inEduSection = true;
      continue;
    }
    if (inEduSection) {
      if (/^(?:experience|skills|projects|certifications|work history|awards)\b/i.test(line)) {
        break;
      }
      educationSection += '\n' + line;
    }
  }

  const searchText = educationSection.trim() || text;

  for (const pattern of EDUCATION_PATTERNS) {
    const match = searchText.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return 'Not explicitly listed';
}

/**
 * Main parser entry point: transforms raw text into a structured Resume Profile
 * @param {string} rawText 
 * @param {string} [fileName] 
 * @param {number} [fileSize] 
 * @returns {Object}
 */
export function parseResume(rawText, fileName = 'Uploaded Resume', fileSize = 0) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('No resume text content provided for parsing.');
  }

  const cleanText = rawText.trim();
  const candidateName = extractCandidateName(cleanText);
  const contact = extractContactDetails(cleanText);
  const experienceYears = extractExperienceYears(cleanText);
  const skills = extractSkillsFromText(cleanText);
  const roles = extractRoles(cleanText);
  const education = extractEducation(cleanText);

  return {
    candidateName,
    email: contact.email,
    phone: contact.phone,
    links: contact.links,
    experienceYears,
    skills,
    roles,
    education,
    rawText: cleanText,
    fileName,
    fileSize,
    updatedAt: new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}
