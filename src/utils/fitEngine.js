/**
 * Apple-grade Deterministic ATS Match & Role Fitness Engine
 * 100% Client-Side · Zero API Keys · Instant (<15ms)
 * Computes deep alignment between Active Job Posting and Candidate Resume Profile.
 */

import { extractSkillsFromText } from './skillTaxonomy.js';

/**
 * Extracts required years of experience from Job Description text
 * Accurately parses ranges (e.g. "4-7 years"), plus notations ("3+ years"),
 * and minimum statements ("minimum 2 years"), while ignoring language version tags like "Java 8+".
 * @param {string} text 
 * @returns {{ minYears: number, maxYears: number|null, displayText: string }|null}
 */
export function extractJdRequiredExperience(text) {
  if (!text) return null;

  // 1. Explicit Range pattern FIRST: e.g. "4-7 years", "4 - 7 yrs", "4 to 7 years"
  const rangeRegex = /\b(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)\s*(?:years|yrs)\b/i;
  const rangeMatch = text.match(rangeRegex);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (min >= 0.5 && max <= 30 && max >= min) {
      return {
        minYears: min,
        maxYears: max,
        displayText: `${min}–${max} yrs`,
      };
    }
  }

  // 2. Plus notation pattern: e.g. "3+ years", "3 + yrs", "2.5+ yrs"
  const plusRegex = /\b(\d+(?:\.\d+)?)\s*\+\s*(?:years|yrs)\b/i;
  const plusMatch = text.match(plusRegex);
  if (plusMatch) {
    const min = parseFloat(plusMatch[1]);
    if (min >= 0.5 && min <= 25) {
      return {
        minYears: min,
        maxYears: null,
        displayText: `${min}+ yrs`,
      };
    }
  }

  // 3. Minimum / at least statements: e.g. "minimum 4 years", "at least 2 years"
  const minRegex = /(?:minimum|at\s+least|require[ds]?)\s*(\d+(?:\.\d+)?)\s*(?:years|yrs)\b/i;
  const minMatch = text.match(minRegex);
  if (minMatch) {
    const min = parseFloat(minMatch[1]);
    if (min >= 0.5 && min <= 25) {
      return {
        minYears: min,
        maxYears: null,
        displayText: `${min}+ yrs`,
      };
    }
  }

  // 4. General pattern: "3 years of experience", "5 years experience"
  const genRegex = /\b(\d+(?:\.\d+)?)\s*(?:years|yrs)(?:\s+of)?\s+(?:experience|exp|hands-on)\b/i;
  const genMatch = text.match(genRegex);
  if (genMatch) {
    const min = parseFloat(genMatch[1]);
    if (min >= 0.5 && min <= 25) {
      return {
        minYears: min,
        maxYears: null,
        displayText: `${min}+ yrs`,
      };
    }
  }

  return null;
}

/**
 * Calculates fitness score and detailed breakdown between Job and Resume
 * @param {Object} jobData 
 * @param {Object} resumeProfile 
 * @returns {Object}
 */
export function calculateFit(jobData, resumeProfile) {
  if (!jobData || !jobData.description) {
    return {
      error: 'No active job description data found.',
    };
  }

  if (!resumeProfile || !resumeProfile.skills) {
    return {
      error: 'No resume profile found. Please upload or paste your resume first.',
    };
  }

  const jdFullText = `${jobData.title || ''} ${jobData.company || ''} ${jobData.description || ''}`;
  
  // 1. Extract skills from Job Description
  const jdSkills = extractSkillsFromText(jdFullText);
  const resumeSkillsSet = new Set(resumeProfile.skills || []);

  // 2. Identify Overlap & Gaps
  const matchedSkills = jdSkills.filter((s) => resumeSkillsSet.has(s));
  const missingSkills = jdSkills.filter((s) => !resumeSkillsSet.has(s));

  // 3. Experience Analysis
  const jdExpInfo = extractJdRequiredExperience(jdFullText);
  const candidateExp = resumeProfile.experienceYears || 0;

  let expScore = 15; // default neutral if unspecified
  let expStatus = 'not_specified';
  let expGap = 0;

  if (jdExpInfo) {
    const minReq = jdExpInfo.minYears;
    if (candidateExp >= minReq) {
      expScore = 20;
      expStatus = 'exceeds_or_meets';
    } else if (candidateExp >= minReq - 1.5) {
      expScore = 12;
      expStatus = 'close_match';
      expGap = Math.round((minReq - candidateExp) * 10) / 10;
    } else {
      expScore = Math.max(3, Math.round((candidateExp / minReq) * 12));
      expStatus = 'below_target';
      expGap = Math.round((minReq - candidateExp) * 10) / 10;
    }
  }

  // 4. Title / Role Keyword Alignment
  let roleBonus = 0;
  if (jobData.title && resumeProfile.roles && resumeProfile.roles.length > 0) {
    const titleLower = jobData.title.toLowerCase();
    const matchesAnyRole = resumeProfile.roles.some((r) => titleLower.includes(r.toLowerCase()));
    if (matchesAnyRole) {
      roleBonus = 5;
    }
  }

  // 5. Final ATS Score Computation (0-100%)
  let finalScore = 0;

  if (jdSkills.length > 0) {
    const skillRatio = matchedSkills.length / jdSkills.length;
    // Base skill score represents up to 75 points
    const skillScore = Math.round(skillRatio * 75);
    finalScore = skillScore + expScore + roleBonus;
  } else {
    // If no distinct tech taxonomy skills found in JD, calculate token overlap
    const jdTokens = new Set(
      jdFullText
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
    const resumeTokens = (resumeProfile.rawText || '')
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/);

    let overlap = 0;
    for (const t of resumeTokens) {
      if (jdTokens.has(t)) overlap++;
    }
    const tokenRatio = Math.min(1, overlap / Math.max(1, jdTokens.size));
    finalScore = Math.round(tokenRatio * 60) + expScore + roleBonus;
  }

  // Clamp score between 15% and 98%
  finalScore = Math.min(98, Math.max(15, finalScore));

  // 6. Tier Categorization (Apple HIG Color Scheme)
  let fitTier = {
    label: 'Stretch Role',
    category: 'stretch',
    color: 'var(--apple-red)',
    iconColor: 'var(--status-danger-text)',
    badgeClass: 'fit-badge-stretch',
    description: 'Requires bridging multiple key skills and specialized prerequisites.',
  };

  if (finalScore >= 75) {
    fitTier = {
      label: 'Strong Match',
      category: 'strong',
      color: 'var(--apple-green)',
      iconColor: 'var(--status-success-text)',
      badgeClass: 'fit-badge-strong',
      description: 'Your profile is an exceptional match for this job description.',
    };
  } else if (finalScore >= 55) {
    fitTier = {
      label: 'Good Match',
      category: 'good',
      color: 'var(--apple-blue)',
      iconColor: 'var(--status-info-text)',
      badgeClass: 'fit-badge-good',
      description: 'Solid overall alignment with high interview readiness.',
    };
  } else if (finalScore >= 40) {
    fitTier = {
      label: 'Moderate Fit',
      category: 'moderate',
      color: 'var(--apple-orange)',
      iconColor: 'var(--status-warning-text)',
      badgeClass: 'fit-badge-moderate',
      description: 'Matches several core requirements with notable skill gaps to address.',
    };
  }

  return {
    score: finalScore,
    ...fitTier,
    jdSkills,
    matchedSkills,
    missingSkills,
    jdExpInfo,
    jdExpRequired: jdExpInfo?.minYears || null,
    candidateExp,
    expStatus,
    expGap,
    totalSkillsFound: jdSkills.length,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
  };
}

/**
 * Builds an AI prompt that specifically emphasizes how to address matched skills and close skill gaps
 * @param {Object} jobData 
 * @param {Object} fitResult 
 * @param {Object} resumeProfile 
 * @returns {string}
 */
export function buildGapTailoredPrompt(jobData, fitResult, resumeProfile) {
  const role = jobData.title || 'the target role';
  const company = jobData.company ? ` at ${jobData.company}` : '';
  const matched = fitResult.matchedSkills?.join(', ') || 'General engineering foundations';
  const missing = fitResult.missingSkills?.length > 0 ? fitResult.missingSkills.join(', ') : 'None identified';
  const expTarget = fitResult.jdExpInfo?.displayText || (fitResult.jdExpRequired ? `${fitResult.jdExpRequired}+ yrs` : 'Not specified');

  return `I am applying for the role of **${role}**${company}.

Here is the ATS Fit Breakdown for my application:
- **Match Score:** ${fitResult.score}% (${fitResult.label})
- **My Verified Matching Skills:** ${matched}
- **Identified Skill Gaps / Missing Keywords:** ${missing}
- **My Experience:** ${resumeProfile.experienceYears || 'Not specified'} years (Job asks for: ${expTarget})

---
### Complete Job Description:
${jobData.description}

---
### My Instructions for AI Tailoring:
1. **Highlight Verified Matches:** Draft 3 high-impact resume bullet points that showcase my experience with: ${matched}.
2. **Bridge Identified Gaps:** Provide recommendations and phrasing on how I can frame transferable skills or recent hands-on projects to address: ${missing}.
3. **ATS Keywords Checklist:** Give me the exact prioritized list of keywords to include in my resume headline and summary to pass the ATS filter.`;
}
