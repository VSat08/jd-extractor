/**
 * Formatters for Job Metadata (Date, Employment Type, Salary)
 * Produces clean, Apple-grade, human-readable strings.
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats a raw datePosted string (e.g. ISO 8601, timestamp, or relative)
 * - "2022-08-23T15:38:17.408Z" -> "Aug 23, 2022"
 * - "2024-03-15" -> "Mar 15, 2024"
 * - "Posted 2 days ago" -> "2 days ago"
 * - "1 week ago" -> "1 week ago"
 */
export function formatDatePosted(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // 1. If it's already a relative expression (e.g. "3 days ago", "posted 1 week ago")
  if (/ago\b/i.test(trimmed) || /today|yesterday|just now/i.test(trimmed)) {
    return trimmed
      .replace(/^(reposted|posted|published)\s*[:·•-]?\s*/i, '')
      .replace(/^[·•-]\s*/, '')
      .trim();
  }

  // 2. Try parsing ISO or timestamp date
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    // Only accept reasonable calendar years
    if (year >= 2000 && year <= 2099) {
      const month = MONTH_NAMES[parsed.getMonth()];
      const day = parsed.getDate();
      return `${month} ${day}, ${year}`;
    }
  }

  // Fallback: strip ugly ISO time tails if regex matches date part
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    if (m >= 0 && m < 12) {
      return `${MONTH_NAMES[m]} ${d}, ${y}`;
    }
  }

  // Return cleaned original if not parseable as date
  return trimmed.replace(/^(reposted|posted)\s*/i, '').trim();
}

/**
 * Formats raw employmentType strings or enums into Apple-styled labels:
 * - "FULL_TIME" -> "Full-time"
 * - "PART_TIME" -> "Part-time"
 * - "CONTRACTOR" / "CONTRACT" -> "Contract"
 * - "INTERN" / "INTERNSHIP" -> "Internship"
 * - "TEMPORARY" -> "Temporary"
 * - "FULL_TIME, CONTRACTOR" -> "Full-time, Contract"
 */
const TYPE_LOOKUP = {
  full_time: 'Full-time',
  fulltime: 'Full-time',
  part_time: 'Part-time',
  parttime: 'Part-time',
  contract: 'Contract',
  contractor: 'Contract',
  temporary: 'Temporary',
  temp: 'Temporary',
  intern: 'Internship',
  internship: 'Internship',
  per_diem: 'Per Diem',
  perdiem: 'Per Diem',
  volunteer: 'Volunteer',
  direct_hire: 'Direct Hire',
  directhire: 'Direct Hire',
  permanent: 'Permanent',
  seasonal: 'Seasonal',
  freelance: 'Freelance',
  remote: 'Remote',
  on_site: 'On-site',
  onsite: 'On-site',
  hybrid: 'Hybrid',
};

export function formatEmploymentType(raw) {
  if (!raw) return '';
  const text = Array.isArray(raw) ? raw.join(', ') : String(raw);
  if (!text.trim()) return '';

  const tokens = text.split(/[,|/]+/).map((t) => t.trim()).filter(Boolean);
  if (tokens.length === 0) return '';

  const formatted = tokens.map((token) => {
    const key = token.toLowerCase().replace(/[\s-]+/g, '_');
    if (TYPE_LOOKUP[key]) return TYPE_LOOKUP[key];

    // Capitalize words, remove underscores
    return token
      .replace(/_/g, ' ')
      .replace(/\b([a-z])/gi, (_, char) => char.toUpperCase());
  });

  // Deduplicate while preserving order
  return Array.from(new Set(formatted)).join(', ');
}

/**
 * Formats salary strings to clean up unitText and spacing
 * - "USD 120,000 - 150,000"
 * - Formats currency symbols where appropriate
 */
export function formatSalary(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let s = raw.trim();
  if (!s) return '';

  // Clean currency prefixes if redundant
  s = s.replace(/\bUSD\s*\$/i, '$')
       .replace(/\bEUR\s*€/i, '€')
       .replace(/\bGBP\s*£/i, '£')
       .replace(/\bINR\s*₹/i, '₹');

  // Format unitText tails if any
  s = s.replace(/\bYEAR\b/i, 'yr')
       .replace(/\bANNUAL\b/i, 'yr')
       .replace(/\bMONTH\b/i, 'mo')
       .replace(/\bHOUR\b/i, 'hr');

  return s;
}
