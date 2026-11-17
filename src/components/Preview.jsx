import React from 'react';

export const Preview = ({ text }) => {
  const charCount = text ? text.length : 0;

  return (
    <div>
      <div className="section-header">
        <span className="section-label">Job Description</span>
        <span className="char-count">{charCount.toLocaleString()} chars</span>
      </div>
      <div className="preview-box">
        {text || 'No description extracted.'}
      </div>
    </div>
  );
};
