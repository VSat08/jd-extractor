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
