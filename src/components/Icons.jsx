import React from 'react';

/**
 * Apple SF Symbol Vector Glyphs & Official Brand Identity
 * Standardized to 20x20 viewBox, 1.5px stroke, round linecaps and joins
 * Strictly NO emojis - 100% vector SVG icons matching Cupertino HIG.
 */

// Official Brand Logo Component (Scalable Apple Squircle Vector with Dual-Sheet & Verified Match)
export const BrandLogo = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block', borderRadius: `${Math.round(size * 0.225)}px`, flexShrink: 0 }}
  >
    <defs>
      <linearGradient id="jdBrandBg" x1="0" y1="0" x2="0" y2="1024" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#007AFF" />
        <stop offset="100%" stopColor="#013CA8" />
      </linearGradient>
      <filter id="jdCardShadow" x="250" y="180" width="600" height="720" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#001041" floodOpacity="0.45" />
      </filter>
      <filter id="jdBadgeShadow" x="150" y="520" width="350" height="350" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="12" stdDeviation="20" floodColor="#001850" floodOpacity="0.5" />
      </filter>
    </defs>

    {/* Apple Squircle Background */}
    <rect width="1024" height="1024" rx="230" fill="url(#jdBrandBg)" />
    
    {/* Apple Specular Bezel / Glass Rim */}
    <rect x="3" y="3" width="1018" height="1018" rx="228" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />

    {/* Back Sheet: Resume (Frosted Glass Card) */}
    <rect x="215" y="174" width="492" height="614" rx="56" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.42)" strokeWidth="5" />
    <rect x="276" y="246" width="174" height="46" rx="16" fill="rgba(255,255,255,0.48)" />
    <rect x="276" y="348" width="317" height="32" rx="14" fill="rgba(255,255,255,0.32)" />
    <rect x="276" y="420" width="317" height="32" rx="14" fill="rgba(255,255,255,0.32)" />
    <rect x="276" y="492" width="220" height="32" rx="14" fill="rgba(255,255,255,0.32)" />

    {/* Front Sheet: Job Description (Solid White Card with Ambient Shadow) */}
    <g filter="url(#jdCardShadow)">
      <rect x="338" y="235" width="492" height="614" rx="56" fill="#FFFFFF" />
    </g>
    
    {/* Front Sheet Category Pill (Apple Blue) */}
    <rect x="399" y="317" width="195" height="56" rx="18" fill="#0071E3" />
    
    {/* Front Sheet Structured Lines */}
    <rect x="399" y="430" width="369" height="36" rx="16" fill="#D7E0EE" />
    <rect x="399" y="502" width="328" height="36" rx="16" fill="#D7E0EE" />
    <rect x="399" y="574" width="246" height="36" rx="16" fill="#D7E0EE" />

    {/* Verified ATS Match & Extraction Badge */}
    <g filter="url(#jdBadgeShadow)">
      <circle cx="389" cy="737" r="138" fill="#0071E3" stroke="#FFFFFF" strokeWidth="14" />
      <path
        d="M331 735 L378 786 L450 690"
        stroke="#FFFFFF"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  </svg>
);

// App / Document icon (doc.text.fill style)
export const DocTextIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3.5C4 2.67 4.67 2 5.5 2H11L16 7V16.5C16 17.33 15.33 18 14.5 18H5.5C4.67 18 4 17.33 4 16.5V3.5Z" />
    <path d="M11 2V7H16" />
    <path d="M7 10.5H13" />
    <path d="M7 13.5H11" />
  </svg>
);

// Sun Max (sun.max - Apple Light Mode)
export const SunMaxIcon = ({ size = 17, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="3.5" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="10" y1="16" x2="10" y2="18" />
    <line x1="4.34" y1="4.34" x2="5.76" y2="5.76" />
    <line x1="14.24" y1="14.24" x2="15.66" y2="15.66" />
    <line x1="2" y1="10" x2="4" y2="10" />
    <line x1="16" y1="10" x2="18" y2="10" />
    <line x1="4.34" y1="15.66" x2="5.76" y2="14.24" />
    <line x1="14.24" y1="5.76" x2="15.66" y2="4.34" />
  </svg>
);

// Moon (moon.fill - Apple Dark Mode)
export const MoonIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.29 12.8A7.5 7.5 0 1 1 9.2 2.71 6 6 0 0 0 17.29 12.8Z" />
  </svg>
);

// Arrow Clockwise (arrow.clockwise - Refresh / Re-extract)
export const ArrowClockwiseIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 2.5V7H13" />
    <path d="M17.2 10.8A7.5 7.5 0 1 1 15.3 5.3L17.5 7" />
  </svg>
);

// Clock Arrow Circlepath (clock.arrow.circlepath - Saved History)
export const ClockArrowIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7.5" />
    <polyline points="10 5.5 10 10 13.5 12" />
  </svg>
);

// Chevron Right (chevron.right - Collapse sidebar)
export const ChevronRightIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7.5 4.5 13 10 7.5 15.5" />
  </svg>
);

// Small Chevron Right for list rows (disclosure indicator)
export const ChevronRightSmallIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 5 13 10 8 15" />
  </svg>
);

// Small Chevron Down for accordion rows (disclosure indicator)
export const ChevronDownSmallIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="5 8 10 13 15 8" />
  </svg>
);

// XMark (xmark - Close / Dismiss)
export const XMarkIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="5" x2="15" y2="15" />
    <line x1="15" y1="5" x2="5" y2="15" />
  </svg>
);

// Checkmark (checkmark - clean SVG vector checkmark for buttons)
export const CheckmarkIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4.5 10.5 8.2 14.2 15.5 6.5" />
  </svg>
);

// Checkmark Circle Fill (checkmark.circle.fill - for badges and toasts)
export const CheckmarkCircleIcon = ({ size = 16, color = '#30D158' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8.5" fill={color} />
    <polyline points="6 10 8.8 12.8 14 7.2" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Document on Clipboard (doc.on.clipboard - Copy for AI)
export const DocOnClipboardIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 5H14.5C15.33 5 16 5.67 16 6.5V16.5C16 17.33 15.33 18 14.5 18H5.5C4.67 18 4 17.33 4 16.5V6.5C4 5.67 4.67 5 5.5 5H7" />
    <rect x="7" y="2" width="6" height="4.5" rx="1.5" />
    <line x1="7.5" y1="10.5" x2="12.5" y2="10.5" />
    <line x1="7.5" y1="13.5" x2="11.5" y2="13.5" />
  </svg>
);

// Document Plaintext (doc.plaintext - Copy Raw JD)
export const DocPlaintextIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3C4.5 2.45 4.95 2 5.5 2H11.5L15.5 6V17C15.5 17.55 15.05 18 14.5 18H5.5C4.95 18 4.5 17.55 4.5 17V3Z" />
    <polyline points="11.5 2 11.5 6 15.5 6" />
    <line x1="7" y1="9.5" x2="13" y2="9.5" />
    <line x1="7" y1="12.5" x2="13" y2="12.5" />
    <line x1="7" y1="15.5" x2="10.5" y2="15.5" />
  </svg>
);

// Arrow Down Document (arrow.down.doc - Export Markdown)
export const ArrowDownDocIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3C4.5 2.45 4.95 2 5.5 2H11L15.5 6.5V17C15.5 17.55 15.05 18 14.5 18H5.5C4.95 18 4.5 17.55 4.5 17V3Z" />
    <polyline points="11 2 11 6.5 15.5 6.5" />
    <line x1="10" y1="9" x2="10" y2="15" />
    <polyline points="7.5 12.5 10 15 12.5 12.5" />
  </svg>
);

// Target / Scope (scope - Resume prompt mode)
export const TargetIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7.5" />
    <circle cx="10" cy="10" r="3.5" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="10" y1="16" x2="10" y2="19" />
    <line x1="1" y1="10" x2="4" y2="10" />
    <line x1="16" y1="10" x2="19" y2="10" />
  </svg>
);

// Envelope (envelope - Cover Letter prompt mode)
export const EnvelopeIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
    <polyline points="3 5.5 10 11 17 5.5" />
  </svg>
);

// Bubble Quote (bubble.left.and.text.bubble.right - Interview Questions prompt mode)
export const BubbleQuoteIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 4.5H5.5C4.12 4.5 3 5.62 3 7C3 7.85 3.43 8.6 4.09 9.04L3.5 12.5L6.68 11.1C7.1 11.23 7.54 11.3 8 11.3H10.5C11.88 11.3 13 10.18 13 8.8V7C13 5.62 11.88 4.5 10.5 4.5Z" />
    <path d="M13 8.5H14.5C15.88 8.5 17 9.62 17 11C17 11.85 16.57 12.6 15.91 13.04L16.5 16.5L13.32 15.1C12.9 15.23 12.46 15.3 12 15.3H9.5C8.85 15.3 8.25 15.05 7.8 14.65" />
  </svg>
);

// Chart Bar (chart.bar.xaxis - Skills prompt mode)
export const ChartBarIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="16.5" x2="17" y2="16.5" />
    <rect x="4.5" y="10" width="2.5" height="6.5" rx="0.5" />
    <rect x="8.75" y="5.5" width="2.5" height="11" rx="0.5" />
    <rect x="13" y="8" width="2.5" height="8.5" rx="0.5" />
  </svg>
);

// Doc on Doc (doc.on.doc - Copy prompt / raw JD)
export const DocOnDocIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6.5" y="6.5" width="9" height="11" rx="1.5" />
    <path d="M4.5 13.5V4.5C4.5 3.67 5.17 3 6 3H12" />
  </svg>
);

// Calendar (calendar - Date posted badge)
export const CalendarIcon = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="13" rx="2.5" />
    <line x1="3" y1="8" x2="17" y2="8" />
    <line x1="7" y1="2" x2="7" y2="4.5" />
    <line x1="13" y1="2" x2="13" y2="4.5" />
  </svg>
);

// Location Pin (mappin.fill - Job location navigation)
export const LocationPinIcon = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2.5C7.24 2.5 5 4.74 5 7.5C5 11.25 10 17.5 10 17.5C10 17.5 15 11.25 15 7.5C15 4.74 12.76 2.5 10 2.5Z" />
    <circle cx="10" cy="7.5" r="2" />
  </svg>
);

// Briefcase (briefcase.fill - Employment type e.g. Full-time, Hybrid)
export const BriefcaseIcon = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="14" height="11" rx="2" />
    <path d="M7 6V4.5C7 3.67 7.67 3 8.5 3H11.5C12.33 3 13 3.67 13 4.5V6" />
    <path d="M3 10.5C6 12 14 12 17 10.5" />
  </svg>
);

// Building (building.2.fill - Company name header)
export const BuildingIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 17.5V4.5C3.5 3.67 4.17 3 5 3H11C11.83 3 12.5 3.67 12.5 4.5V17.5" />
    <path d="M12.5 9H15C15.83 9 16.5 9.67 16.5 10.5V17.5" />
    <line x1="2" y1="17.5" x2="18" y2="17.5" />
    <circle cx="6.5" cy="6.5" r="0.75" fill={color} />
    <circle cx="9.5" cy="6.5" r="0.75" fill={color} />
    <circle cx="6.5" cy="10" r="0.75" fill={color} />
    <circle cx="9.5" cy="10" r="0.75" fill={color} />
  </svg>
);

// Banknote (banknote - Salary compensation badge)
export const BankNoteIcon = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="5" width="15" height="10" rx="2" />
    <circle cx="10" cy="10" r="2.2" />
    <line x1="5.5" y1="7.5" x2="5.5" y2="7.51" strokeWidth="2" />
    <line x1="14.5" y1="12.5" x2="14.5" y2="12.51" strokeWidth="2" />
  </svg>
);

// Trash (trash - Clear History / Resume)
export const TrashIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 5.5H16.5" />
    <path d="M7 5.5V3.5C7 2.95 7.45 2.5 8 2.5H12C12.55 2.5 13 2.95 13 3.5V5.5" />
    <path d="M5 5.5L5.8 16.2C5.85 16.9 6.45 17.5 7.15 17.5H12.85C13.55 17.5 14.15 16.9 14.2 16.2L15 5.5" />
    <line x1="8.5" y1="9" x2="8.5" y2="14" />
    <line x1="11.5" y1="9" x2="11.5" y2="14" />
  </svg>
);

// Sparkles / Apple Intelligence (sparkles - AI prompt modes)
export const SparklesIcon = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2L11.5 7.5L17 9L11.5 10.5L10 16L8.5 10.5L3 9L8.5 7.5L10 2Z" />
    <path d="M15.5 13.5L16.2 15.8L18.5 16.5L16.2 17.2L15.5 19.5L14.8 17.2L12.5 16.5L14.8 15.8L15.5 13.5Z" />
  </svg>
);

// Document with Magnifying Glass (doc.text.magnifyingglass - Empty state)
export const DocMagnifyingGlassIcon = ({ size = 38, color = 'var(--text-3)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="11.5" cy="14.5" r="3" />
    <line x1="13.7" y1="16.7" x2="17" y2="20" />
  </svg>
);

// Person Badge (person.crop.circle - Resume profile tab)
export const PersonBadgeIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="7" r="3.5" />
    <path d="M4 17C4 13.68 6.68 11 10 11C13.32 11 16 13.68 16 17" />
  </svg>
);

// Arrow Up Doc / Upload (arrow.up.doc - Resume upload dropzone)
export const ArrowUpDocIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4C4 2.9 4.9 2 6 2H11L16 7V16C16 17.1 15.1 18 14 18H6C4.9 18 4 17.1 4 16V4Z" />
    <path d="M11 2V7H16" />
    <polyline points="7.5 12.5 10 10 12.5 12.5" />
    <line x1="10" y1="10" x2="10" y2="15" />
  </svg>
);

// Bolt / Lightning (bolt.fill - Instant role fit calculation)
export const BoltIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 2 4 11 10 11 9 18 16 9 10 9 11 2" />
  </svg>
);

// Exclamation Triangle (exclamationmark.triangle - Missing skill gap warning)
export const ExclamationTriangleIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L2 17H18L10 3Z" />
    <line x1="10" y1="8" x2="10" y2="12" />
    <line x1="10" y1="14.5" x2="10" y2="14.51" strokeWidth="2" />
  </svg>
);

// Checkmark Shield (checkmark.shield - 100% private & verified fit)
export const CheckmarkShieldIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2.5L4 5V10C4 14.5 10 17.5 10 17.5C10 17.5 16 14.5 16 10V5L10 2.5Z" />
    <polyline points="7.5 10 9.2 11.8 12.5 8" />
  </svg>
);

// Graduation Cap (graduationcap - Education)
export const GraduationCapIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L2 7.5L10 12L18 7.5L10 3Z" />
    <path d="M5 9.5V14.5C5 14.5 7 16.5 10 16.5C13 16.5 15 14.5 15 14.5V9.5" />
    <path d="M18 7.5V13" />
  </svg>
);

// Clipboard Document (doc.on.clipboard - Job Extractor Tab)
export const ClipboardDocIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3H14C15.1 3 16 3.9 16 5V16C16 17.1 15.1 18 14 18H6C4.9 18 4 17.1 4 16V5C4 3.9 4.9 3 6 3H7" />
    <rect x="7" y="1.5" width="6" height="3" rx="1" />
    <line x1="7" y1="8.5" x2="13" y2="8.5" />
    <line x1="7" y1="12" x2="13" y2="12" />
  </svg>
);

// Question Mark Circle (questionmark.circle - About / FAQ)
export const QuestionMarkCircleIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M7.8 7.8C8.1 7.1 8.8 6.5 9.8 6.5C11.1 6.5 12 7.3 12 8.4C12 9.5 11.2 10.1 10.3 10.6C9.9 10.8 9.7 11.2 9.7 11.6V12" />
    <circle cx="9.75" cy="14.25" r="0.75" fill={color} stroke="none" />
  </svg>
);
