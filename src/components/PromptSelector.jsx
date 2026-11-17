import React, { useRef, useEffect, useState } from 'react';
import { TargetIcon, EnvelopeIcon, BubbleQuoteIcon, ChartBarIcon } from './Icons';

const MODES = [
  { id: 'resume', icon: TargetIcon, label: 'Resume' },
  { id: 'cover', icon: EnvelopeIcon, label: 'Letter' },
  { id: 'questions', icon: BubbleQuoteIcon, label: 'Questions' },
  { id: 'skills', icon: ChartBarIcon, label: 'Skills' },
];

export const PromptSelector = ({ activeMode, onChangeMode }) => {
  const containerRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({});

  const updatePill = () => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector(`.segment-btn[data-mode="${activeMode}"]`);
    if (activeBtn) {
      setPillStyle({
        left: `${activeBtn.offsetLeft}px`,
        width: `${activeBtn.offsetWidth}px`,
      });
    }
  };

  useEffect(() => {
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeMode]);

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '6px' }}>
        <span className="section-label">AI Prompt Mode</span>
      </div>
      <div className="segmented-control" ref={containerRef} role="tablist">
        <div className="segment-pill" style={pillStyle} />
        {MODES.map((mode) => {
          const IconComponent = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              data-mode={mode.id}
              className={`segment-btn ${isActive ? 'active' : ''}`}
              onClick={() => onChangeMode(mode.id)}
              role="tab"
              aria-selected={isActive}
            >
              <IconComponent size={13} color="currentColor" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
