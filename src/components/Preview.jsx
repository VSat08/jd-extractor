import React, { useState } from 'react';
import { renderMarkdownBlocks } from '../utils/markdownRenderer';

export const Preview = ({ text }) => {
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('jd_preview_mode') || 'formatted';
    } catch (_) {
      return 'formatted';
    }
  });

  const charCount = text ? text.length : 0;

  const handleToggleMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('jd_preview_mode', mode);
    } catch (_) {}
  };

  return (
    <div>
      <div className="section-header">
        <span className="section-label">Job Description</span>
        <div className="preview-header-right">
          <div className="preview-toggle-group" role="tablist" aria-label="Job description display mode">
            <button
              type="button"
              className={`preview-toggle-btn ${viewMode === 'formatted' ? 'active' : ''}`}
              onClick={() => handleToggleMode('formatted')}
              title="Formatted document view (Apple Notes style)"
            >
              Formatted
            </button>
            <button
              type="button"
              className={`preview-toggle-btn ${viewMode === 'raw' ? 'active' : ''}`}
              onClick={() => handleToggleMode('raw')}
              title="Raw markdown syntax view"
            >
              Raw
            </button>
          </div>
          <span className="char-count">{charCount.toLocaleString()} chars</span>
        </div>
      </div>

      <div className={`preview-box ${viewMode === 'formatted' ? 'formatted-mode' : 'raw-mode'}`}>
        {!text && <span className="empty-inline-text">No description extracted.</span>}
        {text && viewMode === 'raw' && text}
        {text && viewMode === 'formatted' && renderMarkdownBlocks(text)}
      </div>
    </div>
  );
};
