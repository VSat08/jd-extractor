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
  /\bengineering\s+manager|tech\s+lead|lead\s+developer|staff\s+engineer\b/i,
  /\bui[\/-]ux\s+(?:designer|developer)|product\s+designer\b/i,
];

// Degree patterns with strict word boundaries to avoid false positives (e.g. hibernate -> bernate)
const EDUCATION_PATTERNS = [
  /\b(?:bachelor(?:'s)?(?:\s+degree)?|b\.?tech|b\.?e\.?|b\.?s\.?|b\.?sc)\b(?:\s+(?:of|in)\s+([a-zA-Z\s&]{2,35}))?/i,
  /\b(?:master(?:'s)?(?:\s+degree)?|m\.?tech|m\.?s\.?|m\.?sc|m\.?b\.?a)\b(?:\s+(?:of|in)\s+([a-zA-Z\s&]{2,35}))?/i,
  /\b(?:ph\.?d|doctorate)\b(?:\s+(?:in)\s+([a-zA-Z\s&]{2,35}))?/i,
  /\b(computer\s+science|information\s+technology|software\s+engineering|electrical\s+engineering|data\s+science)\b/i,
];

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
    const line = lines[i];
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

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  const links = [];
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) links.push(`github.com/${githubMatch[1]}`);

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) links.push(`linkedin.com/in/${linkedinMatch[1]}`);

  return { email, phone, links };
}

/**
 * Computes or extracts years of professional experience
 */
function extractExperienceYears(text) {
  if (!text) return 0;

  // 1. Direct explicit mention (e.g. "4+ years of experience", "5.5 years experience")
  const explicitRegex = /(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)(?:\s+of)?\s+(?:experience|exp|hands-on|industry|professional)/i;
  const explicitMatch = text.match(explicitRegex);
  if (explicitMatch) {
    const val = parseFloat(explicitMatch[1]);
    if (val >= 0.5 && val <= 35) {
      return Math.round(val * 10) / 10;
    }
  }

  // 2. Year-based date ranges (e.g. "2021 - Present", "2019 – 2023", "Aug 2020 - Current")
  const currentYear = new Date().getFullYear();
  const dateRangeRegex = /\b(20\d\d)\s*[-–—to]+\s*(20\d\d|present|current|now)\b/gi;
  let match;
  let totalSpan = 0;
  const intervals = [];

  while ((match = dateRangeRegex.exec(text)) !== null) {
    const start = parseInt(match[1], 10);
    const endStr = match[2].toLowerCase();
    const end = (endStr === 'present' || endStr === 'current' || endStr === 'now') ? currentYear : parseInt(endStr, 10);

    if (start >= 1990 && start <= currentYear && end >= start && end <= currentYear + 1) {
      intervals.push([start, end]);
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

    totalSpan = merged.reduce((acc, [s, e]) => acc + (e - s), 0);
    if (totalSpan > 0) {
      return Math.min(30, Math.max(1, totalSpan));
    }
  }

  // 3. Fallback: Secondary mention e.g. "Over 3 years"
  const secondary = text.match(/(?:over|more than|around|approx(?:\.)?)\s*(\d+)\s*(?:years|yrs)/i);
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
      if (/^(?:experience|skills|projects|certifications|work history)\b/i.test(line)) {
        break;
      }
      educationSection += ' ' + line;
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
