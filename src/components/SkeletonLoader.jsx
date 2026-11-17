import React from 'react';

/**
 * Apple Human Interface Skeleton Loader
 * Renders shimmering placeholder geometry matching the exact layout of
 * JobCard, Preview, PromptSelector, and ActionButtons to eliminate layout shifts (CLS).
 */
export const SkeletonLoader = () => {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Loading job description">
      {/* 1. Job Card Skeleton */}
      <div className="apple-card skeleton-card">
        {/* Title bar */}
        <div className="skeleton-box skeleton-title" />
        <div className="skeleton-box skeleton-title-sub" />

        {/* Company row */}
        <div className="skeleton-company-row">
          <div className="skeleton-box skeleton-icon-sm" />
          <div className="skeleton-box skeleton-company-text" />
        </div>

        {/* Badges row */}
        <div className="badge-row">
          <div className="skeleton-box skeleton-badge skeleton-badge-lg" />
          <div className="skeleton-box skeleton-badge skeleton-badge-md" />
          <div className="skeleton-box skeleton-badge skeleton-badge-sm" />
        </div>
      </div>

      {/* 2. Preview (Clean Description) Skeleton */}
      <div className="skeleton-preview-section">
        <div className="section-header">
          <div className="skeleton-box skeleton-label" style={{ width: '100px' }} />
          <div className="skeleton-box skeleton-label" style={{ width: '45px' }} />
        </div>
        <div className="preview-box skeleton-preview-box">
          <div className="skeleton-box skeleton-line" style={{ width: '96%' }} />
          <div className="skeleton-box skeleton-line" style={{ width: '88%' }} />
          <div className="skeleton-box skeleton-line" style={{ width: '92%' }} />
          <div className="skeleton-box skeleton-line" style={{ width: '65%' }} />
          <div className="skeleton-box skeleton-line" style={{ width: '82%', marginTop: '10px' }} />
          <div className="skeleton-box skeleton-line" style={{ width: '75%' }} />
          <div className="skeleton-box skeleton-line" style={{ width: '50%' }} />
        </div>
      </div>

      {/* 3. AI Prompt Mode Selector Skeleton */}
      <div className="skeleton-prompt-section">
        <div className="section-header" style={{ marginBottom: '6px' }}>
          <div className="skeleton-box skeleton-label" style={{ width: '85px' }} />
        </div>
        <div className="segmented-control skeleton-segmented">
          <div className="skeleton-box skeleton-segment" />
          <div className="skeleton-box skeleton-segment" />
          <div className="skeleton-box skeleton-segment" />
          <div className="skeleton-box skeleton-segment" />
        </div>
      </div>

      {/* 4. Action Buttons Skeleton */}
      <div className="action-group">
        <div className="skeleton-box skeleton-btn-primary" />
        <div className="button-row">
          <div className="skeleton-box skeleton-btn-secondary" />
          <div className="skeleton-box skeleton-btn-secondary" />
        </div>
      </div>

      {/* 5. Footer Metadata Skeleton */}
      <div className="skeleton-footer">
        <div className="skeleton-box skeleton-label" style={{ width: '110px', height: '9px', margin: '0 auto' }} />
      </div>
    </div>
  );
};

/**
 * Apple Human Interface Skeleton Loader (Role Fit Tab)
 * Renders shimmering placeholder geometry matching the exact layout of
 * Target Role Banner, Role Match Score, Inset Analysis, Matching Skills,
 * Skill Gaps, and Gap Tailoring Action button to eliminate layout shifts (CLS).
 */
export const FitSkeletonLoader = () => {
  return (
    <div className="fit-view-wrapper skeleton-container" aria-busy="true" aria-label="Calculating role fitness">
      {/* 1. Target Role Banner Skeleton */}
      <div className="apple-card fit-target-banner skeleton-card">
        <div className="skeleton-box skeleton-label" style={{ width: '120px', height: '10px' }} />
        <div className="skeleton-box skeleton-title" style={{ width: '82%', height: '16px', marginTop: '3px' }} />
        <div className="skeleton-box skeleton-line" style={{ width: '35%', height: '12px' }} />
      </div>

      {/* 2. Main Fitness Card Skeleton */}
      <div className="apple-card fit-analysis-card skeleton-card">
        {/* Card Header (Title + Score Badge) */}
        <div className="fit-card-header">
          <div className="fit-header-left" style={{ gap: '8px' }}>
            <div className="skeleton-box skeleton-icon-sm" style={{ width: '15px', height: '15px', borderRadius: '4px' }} />
            <div className="skeleton-box skeleton-title" style={{ width: '115px', height: '14px', marginBottom: 0 }} />
          </div>
          <div className="skeleton-box skeleton-badge" style={{ width: '105px', height: '22px' }} />
        </div>

        {/* Progress Track Skeleton */}
        <div className="fit-progress-track">
          <div className="skeleton-box" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Description line skeleton */}
        <div className="skeleton-box skeleton-line" style={{ width: '78%', height: '12px' }} />

        {/* Analysis Inset Box Skeleton */}
        <div className="fit-analysis-section">
          <div className="skeleton-box skeleton-label" style={{ width: '60px', height: '10px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton-box skeleton-line" style={{ width: '92%', height: '11px' }} />
            <div className="skeleton-box skeleton-line" style={{ width: '74%', height: '11px' }} />
          </div>
        </div>

        {/* Matching Skills Section Skeleton */}
        <div className="fit-skills-section">
          <div className="fit-skills-header">
            <div className="skeleton-box skeleton-label" style={{ width: '120px', height: '12px' }} />
          </div>
          <div className="skills-pill-wrap">
            <div className="skeleton-box skeleton-badge" style={{ width: '75px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '85px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '60px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '90px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '65px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '78px', height: '22px' }} />
          </div>
        </div>

        {/* Skill Gaps Section Skeleton */}
        <div className="fit-skills-section">
          <div className="fit-skills-header">
            <div className="skeleton-box skeleton-label" style={{ width: '150px', height: '12px' }} />
          </div>
          <div className="skills-pill-wrap">
            <div className="skeleton-box skeleton-badge" style={{ width: '70px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '82px', height: '22px' }} />
            <div className="skeleton-box skeleton-badge" style={{ width: '95px', height: '22px' }} />
          </div>
        </div>

        {/* Tailor Button Action Skeleton */}
        <div className="fit-action-row" style={{ marginTop: '2px' }}>
          <div className="skeleton-box skeleton-btn-primary" style={{ height: '34px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </div>
  );
};
