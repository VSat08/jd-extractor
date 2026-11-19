import React from 'react';
import { ClipboardDocIcon, BoltIcon, PersonBadgeIcon } from './Icons';

export const NavSegment = ({ activeTab, onChangeTab }) => {
  return (
    <div className="nav-segment-container">
      <div className="nav-segment-pill-group" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'job'}
          className={`nav-segment-btn ${activeTab === 'job' ? 'active' : ''}`}
          onClick={() => onChangeTab('job')}
        >
          <ClipboardDocIcon size={13} color="currentColor" />
          <span>Job Details</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'fit'}
          className={`nav-segment-btn ${activeTab === 'fit' ? 'active' : ''}`}
          onClick={() => onChangeTab('fit')}
        >
          <BoltIcon size={13} color="currentColor" />
          <span>Role Fit</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'resume'}
          className={`nav-segment-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => onChangeTab('resume')}
        >
          <PersonBadgeIcon size={13} color="currentColor" />
          <span>Resume</span>
        </button>
      </div>
    </div>
  );
};
