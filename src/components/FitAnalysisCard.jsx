import React from 'react';
import {
  BoltIcon,
  PersonBadgeIcon,
  SparklesIcon,
  ChevronRightSmallIcon,
  ClipboardDocIcon,
} from './Icons';
import { calculateFit } from '../utils/fitEngine.js';

export const FitAnalysisCard = ({
  jobData,
  resumeProfile,
  onNavigateToResume,
  onApplyGapTailoredPrompt,
  showToast,
}) => {
  // Case 1: No active Job Posting detected
  if (!jobData || !jobData.description) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon-wrap">
            <ClipboardDocIcon size={26} color="var(--apple-blue)" />
          </div>
          <h2 className="empty-title">No Active Job Description</h2>
          <p className="empty-subtitle">
            Navigate to any job posting on LinkedIn, Workday, Indeed, or career portals to check your role fitness.
          </p>
        </div>
      </div>
    );
  }

  // Case 2: Job detected, but No Resume Profile uploaded
  if (!resumeProfile) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon-wrap">
            <PersonBadgeIcon size={26} color="var(--apple-blue)" />
          </div>
          <h2 className="empty-title">Upload Resume to Check Fit</h2>
          <p className="empty-subtitle">
            Upload your resume once to get instant ATS scores, find missing keywords, and tailor prompts for {jobData.title || 'this position'}.
          </p>
          <div className="empty-actions">
            <button
              type="button"
              className="btn btn-filled"
              onClick={onNavigateToResume}
            >
              <span>Go to My Resume</span>
              <ChevronRightSmallIcon size={12} color="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Calculate Fit
  const fit = calculateFit(jobData, resumeProfile);
  if (fit.error) return null;

  const handleTailorPrompt = () => {
    if (onApplyGapTailoredPrompt) {
      onApplyGapTailoredPrompt(fit);
    }
  };

  return (
    <div className="fit-view-wrapper">
      {/* Target Job Header Card */}
      <div className="apple-card fit-target-banner">
        <span className="fit-banner-label">Target Role Analysis</span>
        <h3 className="fit-target-title">{jobData.title || 'Untitled Role'}</h3>
        {jobData.company && <p className="fit-target-company">{jobData.company}</p>}
      </div>

      {/* Main Fitness Card */}
      <div className="apple-card fit-analysis-card">
        {/* Top Header Row with Score Badge */}
        <div className="fit-card-header">
          <div className="fit-header-left">
            <BoltIcon size={15} color={fit.iconColor || fit.color} />
            <span className="fit-header-title">Role Match Score</span>
          </div>
          <span className={`apple-badge ${fit.badgeClass}`}>
            <span className="fit-score-num">{fit.score}%</span>
            <span className="fit-score-label">{fit.label}</span>
          </span>
        </div>

        {/* Progress Track */}
        <div className="fit-progress-track">
          <div
            className="fit-progress-fill"
            style={{
              width: `${fit.score}%`,
              background: fit.color,
            }}
          />
        </div>

        <p className="fit-tier-description">{fit.description}</p>

        {/* Analysis Section */}
        <div className="fit-analysis-section">
          <span className="fit-section-heading">Analysis</span>
          <ul className="fit-analysis-list">
            {fit.jdExpInfo ? (
              <li className="fit-analysis-item">
                <span className="fit-bullet">•</span>
                <span className="fit-item-text">
                  {fit.expStatus === 'below_target' && (
                    <strong className="text-warning">Experience Gap: </strong>
                  )}
                  {fit.expStatus === 'close_match' && (
                    <strong className="text-neutral">Close Experience Match: </strong>
                  )}
                  {fit.expStatus === 'exceeds_or_meets' && (
                    <strong className="text-success">Experience Match: </strong>
                  )}
                  Job asks for <strong>{fit.jdExpInfo.displayText}</strong> · You have{' '}
                  <strong>{fit.candidateExp > 0 ? `${fit.candidateExp} yrs` : 'entry level'}</strong>
                  {fit.expGap > 0 && ` (${fit.expGap} yr gap)`}
                </span>
              </li>
            ) : (
              <li className="fit-analysis-item">
                <span className="fit-bullet">•</span>
                <span className="fit-item-text">
                  <strong>Experience: </strong>
                  Not explicitly specified in posting · Your profile has{' '}
                  <strong>{fit.candidateExp > 0 ? `${fit.candidateExp} yrs` : 'entry level'}</strong>
                </span>
              </li>
            )}

            {fit.totalSkillsFound > 0 && (
              <li className="fit-analysis-item">
                <span className="fit-bullet">•</span>
                <span className="fit-item-text">
                  <strong>Skill Match: </strong>
                  {fit.matchedCount} of {fit.totalSkillsFound} required skills identified (
                  {Math.round((fit.matchedCount / fit.totalSkillsFound) * 100)}% coverage)
                  {fit.missingCount > 0 && ` · ${fit.missingCount} gaps to bridge`}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Matched Skills Chips (Clean, consistent section header) */}
        <div className="fit-skills-section">
          <div className="fit-skills-header">
            <span className="fit-skills-title">
              Matching Skills ({fit.matchedCount})
            </span>
          </div>
          {fit.matchedSkills?.length > 0 ? (
            <div className="skills-pill-wrap">
              {fit.matchedSkills.map((skill) => (
                <span key={skill} className="skill-chip chip-success">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-inline-text">No direct keyword overlap with listed technical skills.</p>
          )}
        </div>

        {/* Missing Skills / Gaps Chips (Clean, consistent section header) */}
        {fit.missingSkills?.length > 0 && (
          <div className="fit-skills-section">
            <div className="fit-skills-header">
              <span className="fit-skills-title">
                Skill Gaps & Missing Keywords ({fit.missingCount})
              </span>
            </div>
            <div className="skills-pill-wrap">
              {fit.missingSkills.map((skill) => (
                <span key={skill} className="skill-chip chip-warning">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tailor for Gaps Action Button */}
        <div className="fit-action-row">
          <button
            type="button"
            className="btn btn-secondary fit-tailor-btn"
            onClick={handleTailorPrompt}
          >
            <SparklesIcon size={14} color="var(--apple-blue)" />
            <span>Tailor AI Prompt for Gaps</span>
          </button>
        </div>
      </div>
    </div>
  );
};
