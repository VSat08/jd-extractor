import React from 'react';
import {
  XMarkIcon,
  CheckmarkShieldIcon,
  BoltIcon,
  SparklesIcon,
  DocTextIcon,
} from './Icons';

export const InfoSheet = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="sheet-overlay">
      <div className="sheet-header">
        <h2 className="sheet-title">About & Privacy</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close info sheet">
          <XMarkIcon size={13} />
        </button>
      </div>

      <div className="info-sheet-body">
        {/* Section 1: Privacy */}
        <div className="info-item-card">
          <div className="info-item-icon-wrap icon-shield">
            <CheckmarkShieldIcon size={16} color="var(--status-success-text)" />
          </div>
          <div className="info-item-content">
            <h3 className="info-item-title">100% On-Device & Private</h3>
            <p className="info-item-desc">
              All job extraction, resume parsing, and role match scoring run completely on your device in browser memory. No resumes, job postings, or personal data are ever uploaded to cloud servers or third parties.
            </p>
          </div>
        </div>

        {/* Section 2: Deterministic ATS Engine */}
        <div className="info-item-card">
          <div className="info-item-icon-wrap icon-bolt">
            <BoltIcon size={16} color="var(--status-info-text)" />
          </div>
          <div className="info-item-content">
            <h3 className="info-item-title">Instant ATS Matching Engine</h3>
            <p className="info-item-desc">
              Compares your resume against target job requirements in under 2ms using a standardized ontology of 600+ industry tech skills, experience thresholds, and title relevance. Zero API fees and zero LLM hallucinations.
            </p>
          </div>
        </div>

        {/* Section 3: AI Prompts */}
        <div className="info-item-card">
          <div className="info-item-icon-wrap icon-sparkles">
            <SparklesIcon size={16} color="var(--status-warning-text)" />
          </div>
          <div className="info-item-content">
            <h3 className="info-item-title">AI Prompt Optimization</h3>
            <p className="info-item-desc">
              Generate structured prompts for ChatGPT, Claude, and Gemini with one click. Formatted specifically for ATS keyword targeting, STAR interview preparation, and addressing missing skill gaps.
            </p>
          </div>
        </div>

        {/* Section 4: Keyboard Shortcuts & Tips */}
        <div className="info-item-card">
          <div className="info-item-icon-wrap icon-keys">
            <DocTextIcon size={16} color="var(--text-1)" />
          </div>
          <div className="info-item-content">
            <h3 className="info-item-title">Keyboard Shortcuts & Portals</h3>
            <p className="info-item-desc">
              Use <kbd className="info-kbd">Ctrl+Shift+J</kbd> (or <kbd className="info-kbd">⌘+Shift+J</kbd> on Mac) to toggle the side panel at any time. Press <kbd className="info-kbd">Esc</kbd> to dismiss sheets. Works across LinkedIn, Workday, Indeed, Greenhouse, Lever, and enterprise career portals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
