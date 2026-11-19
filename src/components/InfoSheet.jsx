import React, { useState } from 'react';
import {
  XMarkIcon,
  BrandLogo,
  ChevronDownSmallIcon,
} from './Icons';

const FAQ_SECTIONS = [
  {
    id: 'privacy',
    title: 'Privacy & Security',
    items: [
      {
        id: 'cloud-storage',
        q: 'Is my resume or job data sent to any cloud server?',
        a: 'Never. 100% of PDF resume parsing, job description extraction, and ATS match calculations run entirely in your local browser memory. Zero external server uploads, zero telemetry, and zero third-party tracking.',
      },
      {
        id: 'resume-storage',
        q: 'Where is my uploaded resume saved?',
        a: "Your resume profile is saved strictly in your browser's private chrome.storage.local sandbox on your own device. You can update, replace, or permanently delete it at any time from the 'My Resume' tab.",
      },
      {
        id: 'api-keys',
        q: 'Do I need an OpenAI, Claude, or Gemini API key?',
        a: 'No API keys required. The extraction engine and deterministic ATS matcher are completely self-contained within the extension, costing $0.00 to run indefinitely.',
      },
    ],
  },
  {
    id: 'engine',
    title: 'Deterministic ATS Engine',
    items: [
      {
        id: 'fit-score-calc',
        q: 'How is the Role Match Score calculated?',
        a: 'Our mathematical algorithm scores 3 distinct dimensions without LLM hallucination: (1) Technical Skills Coverage (up to 75 pts) mapped against 600+ industry skills with alias normalization; (2) Experience Thresholds (up to 20 pts) accurately parsing ranges like 4–7 yrs against your history; (3) Role Relevance (up to 5 pts) comparing title alignment.',
      },
      {
        id: 'no-llm-why',
        q: 'Why deterministic scoring instead of an LLM prompt?',
        a: 'Standard LLMs often hallucinate candidate years of experience, confuse college projects with enterprise production work, and fluctuate between runs. JD Extractor gives recruiters and candidates instant (< 2ms), reproducible, and strictly verified results.',
      },
      {
        id: 'gap-tailor',
        q: 'How does the "Tailor AI Prompt for Gaps" feature work?',
        a: 'When you click Tailor AI Prompt for Gaps, the engine synthesizes all missing keywords and verified skill matches into an optimized STAR-format prompt ready to paste into ChatGPT, Claude, or Gemini to tailor your application.',
      },
    ],
  },
  {
    id: 'portals',
    title: 'Portals & AI Workflows',
    items: [
      {
        id: 'supported-portals',
        q: 'Which career portals and job sites are supported?',
        a: 'Optimized with dedicated selectors for LinkedIn (including 2-pane search results with right-rail isolation), Workday, Indeed, Greenhouse, Lever, Ashby, and Naukri, with automated heuristic fallback for custom company portals.',
      },
      {
        id: 'linkedin-search',
        q: 'How does LinkedIn 2-pane isolation work?',
        a: 'On linkedin.com/jobs/search-results, clicking any job in the left list immediately extracts only the right-hand details pane (.scaffold-layout__detail), filtering out search list noise, ads, and bottom messaging chats.',
      },
      {
        id: 'markdown-export',
        q: 'Can I export clean Markdown files?',
        a: "Yes. In the Job JD tab, clicking 'Save as Markdown (.md)' downloads a cleanly structured markdown document containing the role title, company metadata, salary, and sanitized description.",
      },
    ],
  },
];

export const InfoSheet = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(
    () => new Set(['cloud-storage', 'fit-score-calc', 'supported-portals'])
  );

  if (!isOpen) return null;

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    const allItemIds = FAQ_SECTIONS.flatMap((s) => s.items.map((i) => i.id));
    if (openItems.size === allItemIds.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(allItemIds));
    }
  };

  const filteredSections =
    activeCategory === 'all'
      ? FAQ_SECTIONS
      : FAQ_SECTIONS.filter((s) => s.id === activeCategory);

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Help and FAQ">
      <div className="sheet-header">
        <h2 className="sheet-title">Help & FAQ</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close help sheet">
          <XMarkIcon size={14} />
        </button>
      </div>

      <div className="info-sheet-body">
        {/* 1. Hero Identity Card */}
        <div className="faq-hero-card">
          <div className="faq-hero-top">
            <BrandLogo size={38} />
            <div className="faq-hero-info">
              <div className="faq-hero-title-row">
                <h3 className="faq-hero-title">JD Extractor</h3>
                <span className="version-pill">v1.0.0</span>
              </div>
              <p className="faq-hero-subtitle">
                Job Description Extractor & ATS Resume Matcher
              </p>
            </div>
          </div>
          <div className="faq-badges-row">
            <span className="apple-badge badge-accent">100% On-Device</span>
            <span className="apple-badge">Deterministic Math</span>
            <span className="apple-badge badge-neutral">Zero Cloud Fees</span>
          </div>
        </div>

        {/* 2. Category Filter Strip & Expand/Collapse */}
        <div className="faq-filter-bar">
          <div className="faq-filter-pills" role="tablist">
            <button
              type="button"
              className={`faq-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`faq-filter-btn ${activeCategory === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveCategory('privacy')}
            >
              Privacy
            </button>
            <button
              type="button"
              className={`faq-filter-btn ${activeCategory === 'engine' ? 'active' : ''}`}
              onClick={() => setActiveCategory('engine')}
            >
              ATS Engine
            </button>
            <button
              type="button"
              className={`faq-filter-btn ${activeCategory === 'portals' ? 'active' : ''}`}
              onClick={() => setActiveCategory('portals')}
            >
              Portals
            </button>
          </div>
          <button
            type="button"
            className="faq-toggle-all-btn"
            onClick={handleToggleAll}
          >
            {openItems.size === FAQ_SECTIONS.flatMap((s) => s.items).length
              ? 'Collapse all'
              : 'Expand all'}
          </button>
        </div>

        {/* 3. Categorized Accordion FAQ Sections */}
        {filteredSections.map((section) => (
          <div key={section.id} className="faq-section">
            <div className="faq-section-header">
              <span className="section-label">{section.title}</span>
            </div>
            <div className="faq-accordion-group">
              {section.items.map((item) => {
                const isOpenItem = openItems.has(item.id);
                return (
                  <div key={item.id} className="faq-item">
                    <button
                      type="button"
                      className="faq-item-trigger"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpenItem}
                    >
                      <span className="faq-question-text">{item.q}</span>
                      <span className={`faq-chevron ${isOpenItem ? 'open' : ''}`}>
                        <ChevronDownSmallIcon size={13} color="currentColor" />
                      </span>
                    </button>
                    {isOpenItem && (
                      <div className="faq-item-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 4. Keyboard Shortcuts Quick Reference */}
        <div className="faq-section">
          <div className="faq-section-header">
            <span className="section-label">Keyboard Shortcuts</span>
          </div>
          <div className="apple-card faq-shortcuts-card">
            <div className="faq-shortcut-row">
              <span className="shortcut-label">Toggle Side Panel</span>
              <div className="shortcut-keys">
                <kbd className="info-kbd">Ctrl</kbd>
                <span className="key-plus">+</span>
                <kbd className="info-kbd">Shift</kbd>
                <span className="key-plus">+</span>
                <kbd className="info-kbd">J</kbd>
              </div>
            </div>
            <div className="faq-shortcut-row">
              <span className="shortcut-label">Mac Shortcut</span>
              <div className="shortcut-keys">
                <kbd className="info-kbd">⌘</kbd>
                <span className="key-plus">+</span>
                <kbd className="info-kbd">Shift</kbd>
                <span className="key-plus">+</span>
                <kbd className="info-kbd">J</kbd>
              </div>
            </div>
            <div className="faq-shortcut-row">
              <span className="shortcut-label">Dismiss Sheets / Dialogs</span>
              <kbd className="info-kbd">Esc</kbd>
            </div>
          </div>
        </div>

        {/* 5. Minimal Cupertino Footer */}
        <div className="faq-footer-card">
          <span>JD Extractor · Job Description Extractor & ATS Resume Matcher</span>
          <span>100% On-Device Privacy Architecture · Manifest V3</span>
        </div>
      </div>
    </div>
  );
};
