import React from 'react';
import {
  DocTextIcon,
  SunMaxIcon,
  MoonIcon,
  ArrowClockwiseIcon,
  ClockArrowIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from './Icons';

export const Header = ({
  theme,
  onToggleTheme,
  onRefresh,
  onOpenHistory,
  onOpenInfo,
  onCollapse,
}) => {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-icon-wrap">
          <DocTextIcon size={14} color="#FFFFFF" />
        </div>
        <h1 className="app-title">JD Extractor</h1>
        <span className="version-pill">v1.0.0</span>
      </div>

      <div className="header-actions">
        {/* Appearance Toggle (Light / Dark) */}
        <button 
          className="icon-btn" 
          onClick={onToggleTheme} 
          title={`Appearance: ${theme === 'dark' ? 'Dark' : 'Light'} (Click to switch)`}
          aria-label="Toggle light or dark theme"
        >
          {theme === 'dark' ? <MoonIcon size={15} /> : <SunMaxIcon size={16} />}
        </button>

        {/* Refresh / Re-extract */}
        <button 
          className="icon-btn" 
          onClick={onRefresh} 
          title="Re-extract Active Tab"
          aria-label="Re-extract active tab"
        >
          <ArrowClockwiseIcon size={15} />
        </button>

        {/* Saved Clips History */}
        <button 
          className="icon-btn" 
          onClick={onOpenHistory} 
          title="Recent Clips"
          aria-label="Recent clips"
        >
          <ClockArrowIcon size={15} />
        </button>

        {/* Info & Privacy FAQ */}
        <button 
          className="icon-btn" 
          onClick={onOpenInfo} 
          title="About & Privacy FAQ"
          aria-label="About and privacy FAQ"
        >
          <QuestionMarkCircleIcon size={15} />
        </button>

        {/* Close Side Panel */}
        <button 
          className="icon-btn" 
          onClick={onCollapse} 
          title="Close Side Panel (Esc)"
          aria-label="Close side panel"
        >
          <ChevronRightIcon size={15} />
        </button>
      </div>
    </header>
  );
};
