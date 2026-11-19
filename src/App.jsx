import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NavSegment } from './components/NavSegment';
import { JobCard } from './components/JobCard';
import { FitAnalysisCard } from './components/FitAnalysisCard';
import { ResumeView } from './components/ResumeView';
import { Preview } from './components/Preview';
import { PromptSelector } from './components/PromptSelector';
import { ActionButtons } from './components/ActionButtons';
import { HistorySheet } from './components/HistorySheet';
import { InfoSheet } from './components/InfoSheet';
import { SkeletonLoader, FitSkeletonLoader } from './components/SkeletonLoader';
import { Toast } from './components/Toast';
import { SplashScreen } from './components/SplashScreen';
import {
  DocMagnifyingGlassIcon,
  ArrowClockwiseIcon,
  ClockArrowIcon,
  BoltIcon,
  PersonBadgeIcon,
  BrandLogo,
  ArrowUpRightIcon,
} from './components/Icons';
import { getResumeProfile, saveResumeProfile, deleteResumeProfile } from './utils/storage';
import { buildGapTailoredPrompt } from './utils/fitEngine';
import { formatDatePosted, formatEmploymentType, formatSalary } from './utils/formatters';

// Helper to verify extension context is alive (prevents "Extension context invalidated" errors after reloads)
const isContextValid = () => {
  try {
    return Boolean(typeof chrome !== 'undefined' && chrome?.runtime && !!chrome.runtime.id);
  } catch (_) {
    return false;
  }
};

export const App = () => {
  // Theme state: default to system preference or saved
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('jd_apple_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Mobile-style launch splash screen: displays cleanly when side panel is opened
  const [showSplash, setShowSplash] = useState(true);

  const [activeTab, setActiveTab] = useState('job'); // 'job' | 'fit' | 'resume'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [promptMode, setPromptMode] = useState('resume');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [resumeProfile, setResumeProfile] = useState(null);
  const [customGapPrompt, setCustomGapPrompt] = useState(null);

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('jd_apple_theme', theme);
  }, [theme]);

  // Load saved resume on startup
  useEffect(() => {
    const initResume = async () => {
      try {
        const saved = await getResumeProfile();
        if (saved) {
          setResumeProfile(saved);
        }
      } catch (err) {
        console.warn('[App] Could not load resume profile:', err);
      }
    };
    initResume();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2200);
  }, []);

  // Save clip to history
  const saveToHistory = useCallback((data) => {
    try {
      const saved = JSON.parse(localStorage.getItem('jd_react_history') || '[]');
      const entry = {
        id: Date.now(),
        title: data.title || 'Untitled Role',
        company: data.company || 'Unknown Company',
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        data,
      };
      const filtered = saved.filter((s) => !(s.title === entry.title && s.company === entry.company));
      const updated = [entry, ...filtered].slice(0, 20);
      localStorage.setItem('jd_react_history', JSON.stringify(updated));
      setHistoryItems(updated);
    } catch (_) {}
  }, []);

  const loadHistory = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('jd_react_history') || '[]');
      setHistoryItems(saved);
    } catch (_) {}
  }, []);

  const handleExtractionResult = useCallback((res) => {
    setLoading(false);
    if (!res || res.error) {
      setError(res?.message || 'No job description found on this page.');
      setJobData(null);
      setCustomGapPrompt(null);
      return;
    }
    setJobData(res);
    setError(null);
    setCustomGapPrompt(null);
    saveToHistory(res);
  }, [saveToHistory]);

  // Reliable active tab finder for Side Panel context
  const getActiveTab = useCallback(async () => {
    if (!isContextValid() || !chrome?.tabs) return null;

    // 1. In Side Panel context, lastFocusedWindow targets the browser window holding web tabs
    try {
      const [focusedTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (focusedTab && focusedTab.id) {
        return focusedTab;
      }
    } catch (err) {
      if (err?.message?.includes('context invalidated')) return null;
    }

    // 2. Fallback: normal browser window
    try {
      if (chrome.windows?.getLastFocused) {
        const normalWin = await chrome.windows.getLastFocused({ windowTypes: ['normal'] }).catch(() => null);
        if (normalWin && normalWin.id && isContextValid()) {
          const [winTab] = await chrome.tabs.query({ active: true, windowId: normalWin.id });
          if (winTab && winTab.id) return winTab;
        }
      }
    } catch (err) {
      if (err?.message?.includes('context invalidated')) return null;
    }

    // 3. Fallback: currentWindow
    try {
      if (isContextValid() && chrome.tabs) {
        const [currTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (currTab && currTab.id) return currTab;
      }
    } catch (err) {
      if (err?.message?.includes('context invalidated')) return null;
    }

    return null;
  }, []);

  // Extraction logic: dynamically targets the currently active browser tab
  const extractData = useCallback(async () => {
    if (!isContextValid()) {
      setError('Extension was reloaded. Please refresh the page (F5) or re-open the side panel.');
      setJobData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tab = await getActiveTab();
      if (!tab || !tab.id) {
        setError('No active tab detected.');
        setJobData(null);
        setLoading(false);
        return;
      }

      const url = tab.url || '';
      if (/^(chrome|edge|about|chrome-extension):/i.test(url)) {
        setError('This is a browser system page. Switch to any tab with a job posting (e.g. LinkedIn, Workday, Citi, Indeed).');
        setJobData(null);
        setLoading(false);
        return;
      }

      let res = null;
      try {
        if (!isContextValid()) return;
        res = await chrome.tabs.sendMessage(tab.id, { action: 'extract_jd' });
      } catch (sendErr) {
        if (sendErr?.message?.includes('context invalidated')) {
          setError('Extension was reloaded. Please refresh the page (F5) or re-open the side panel.');
          setJobData(null);
          setLoading(false);
          return;
        }

        // If content script was not ready yet (e.g. tab just reloaded), inject via scripting
        if (chrome.scripting && isContextValid()) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js'],
            });
            await new Promise((r) => setTimeout(r, 80));
            if (isContextValid()) {
              res = await chrome.tabs.sendMessage(tab.id, { action: 'extract_jd' });
            }
          } catch (injectErr) {
            if (injectErr?.message?.includes('context invalidated')) {
              setError('Extension was reloaded. Please refresh the page (F5) or re-open the side panel.');
              setJobData(null);
              setLoading(false);
              return;
            }
            console.warn('[JD Extractor] Script injection error:', injectErr);
          }
        }
      }

      if (res?.loading) {
        setLoading(true);
        setTimeout(() => {
          if (isContextValid()) extractData();
        }, 350);
        return;
      }

      if (res && !res.error && res.description) {
        handleExtractionResult(res);
      } else {
        setError(res?.message || 'No job description found on this page. Make sure you are on a specific job posting page.');
        setJobData(null);
        setLoading(false);
      }
    } catch (globalErr) {
      if (globalErr?.message?.includes('context invalidated')) {
        setError('Extension was reloaded. Please refresh the page (F5) or re-open the side panel.');
      } else {
        setError(globalErr?.message || 'An unexpected extraction error occurred.');
      }
      setJobData(null);
      setLoading(false);
    }
  }, [getActiveTab, handleExtractionResult]);

  // Listen to tab switching & updates across the browser (Native Side Panel functionality)
  useEffect(() => {
    if (!isContextValid() || !chrome?.tabs) return;

    const onTabActivated = () => {
      if (isContextValid()) extractData();
    };

    const onTabUpdated = (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab?.active && isContextValid()) {
        extractData();
      }
    };

    const onRuntimeMessage = (message) => {
      if (!isContextValid()) return;
      if (message?.action === 'job_selection_started') {
        setLoading(true);
        setError(null);
      } else if (message?.action === 'spa_url_changed') {
        extractData();
      } else if (message?.action === 'auto_extraction_complete' && message?.data) {
        handleExtractionResult(message.data);
      }
    };

    try {
      chrome.tabs.onActivated.addListener(onTabActivated);
      chrome.tabs.onUpdated.addListener(onTabUpdated);
      if (chrome.runtime?.onMessage) {
        chrome.runtime.onMessage.addListener(onRuntimeMessage);
      }
    } catch (_) {}

    return () => {
      try {
        if (isContextValid()) {
          chrome.tabs?.onActivated?.removeListener(onTabActivated);
          chrome.tabs?.onUpdated?.removeListener(onTabUpdated);
          chrome.runtime?.onMessage?.removeListener(onRuntimeMessage);
        }
      } catch (_) {}
    };
  }, [extractData, handleExtractionResult]);

  // Initial load
  useEffect(() => {
    loadHistory();
    extractData();
  }, [extractData, loadHistory]);

  // Close Side Panel action
  const handleCollapse = useCallback(() => {
    try {
      window.close();
    } catch (_) {}
  }, []);

  // Listen for Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (infoOpen) {
          setInfoOpen(false);
        } else if (historyOpen) {
          setHistoryOpen(false);
        } else {
          try {
            window.close();
          } catch (_) {}
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [historyOpen, infoOpen]);

  // Resume handlers
  const handleSaveResume = async (profile) => {
    await saveResumeProfile(profile);
    setResumeProfile(profile);
  };

  const handleDeleteResume = async () => {
    await deleteResumeProfile();
    setResumeProfile(null);
    setCustomGapPrompt(null);
    showToast('Resume profile removed');
  };

  const handleApplyGapTailoredPrompt = async (fit) => {
    if (!jobData || !resumeProfile) return;
    const prompt = buildGapTailoredPrompt(jobData, fit, resumeProfile);
    setCustomGapPrompt(prompt);
    setPromptMode('resume');
    try {
      await navigator.clipboard.writeText(prompt);
      showToast('Copied AI Gap-Tailored Prompt!');
    } catch (_) {
      showToast('Gap-tailored prompt ready');
    }
  };

  // Plain JD Formatter
  const buildPlainJD = (data) => {
    const parts = [];
    if (data.title) parts.push(`## ${data.title}`);
    const meta = [];
    if (data.company)  meta.push(`**Company:** ${data.company}`);
    if (data.location) meta.push(`**Location:** ${data.location}`);
    const displayType = formatEmploymentType(data.type);
    if (displayType)   meta.push(`**Type:** ${displayType}`);
    const displaySalary = formatSalary(data.salary);
    if (displaySalary) meta.push(`**Salary:** ${displaySalary}`);
    const displayDate = formatDatePosted(data.datePosted);
    if (displayDate)   meta.push(`**Date Posted:** ${displayDate}`);
    if (meta.length)   parts.push(meta.join('\n'));
    parts.push('---');
    parts.push(data.description || '');
    return parts.join('\n\n');
  };

  // AI Prompt Formatter (4 Modes)
  const buildAIPrompt = (data, mode) => {
    if (customGapPrompt && mode === 'resume') {
      return customGapPrompt;
    }

    const role = data.title || 'the target role';
    const company = data.company ? ` at ${data.company}` : '';
    const jd = buildPlainJD(data);

    switch (mode) {
      case 'cover':
        return `I am applying for the role of **${role}**${company}.

Please write a highly persuasive, authentic, and tailored Cover Letter for this position.
- Emphasize alignment with the specific responsibilities and qualifications mentioned below.
- Keep the tone confident, professional, and engaging.

---
### Job Description:
${jd}`;

      case 'questions':
        return `I am preparing for an interview for the role of **${role}**${company}.

Based on the job description below, please generate:
1. Top 5 technical / hard-skill questions likely to be asked
2. Top 5 behavioral questions (using the STAR format)
3. Concise bullet points for what a standout answer should cover

---
### Job Description:
${jd}`;

      case 'skills':
        return `Please analyze this job description for **${role}**${company} and provide:
1. **Core Must-Have Technical Skills** (Ranked by priority)
2. **Key Tools, Frameworks & Certifications**
3. **Essential Soft Skills & Cultural Fit Signals**
4. **ATS Missing Keywords** to optimize for

---
### Job Description:
${jd}`;

      case 'resume':
      default:
        return `I am applying for the role of **${role}**${company}.

Here is the complete job description:
${jd}

---
Please help me tailor my resume for this position:
1. Extract the top 10 ATS keywords I must include.
2. Provide 3–5 high-impact bullet points rewritten with action verbs and metrics for this role.
3. Highlight the most critical requirements I should address first.`;
    }
  };

  // Copy Handlers
  const handleCopyAi = async () => {
    if (!jobData) return false;
    const text = buildAIPrompt(jobData, promptMode);
    try {
      await navigator.clipboard.writeText(text);
      showToast(customGapPrompt && promptMode === 'resume' ? 'Copied Gap-Tailored Prompt' : `Copied ${promptMode} prompt`);
      return true;
    } catch {
      showToast('Failed to copy');
      return false;
    }
  };

  const handleCopyJd = async () => {
    if (!jobData) return false;
    const text = buildPlainJD(jobData);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Clean JD copied');
      return true;
    } catch {
      showToast('Failed to copy');
      return false;
    }
  };

  const handleExportMd = () => {
    if (!jobData) return;
    const text = buildPlainJD(jobData);
    const slug = (jobData.title || 'job-description').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Saved as Markdown file');
  };

  const handleSelectHistory = (data) => {
    setJobData(data);
    setError(null);
    setCustomGapPrompt(null);
    setActiveTab('job');
    setHistoryOpen(false);
    showToast('Restored from history');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('jd_react_history');
    setHistoryItems([]);
    showToast('History cleared');
  };

  const handleOpenLinkedInJobs = () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: 'https://www.linkedin.com/jobs/' });
      } else {
        window.open('https://www.linkedin.com/jobs/', '_blank');
      }
    } catch (_) {
      window.open('https://www.linkedin.com/jobs/', '_blank');
    }
  };

  return (
    <div className="app-container">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={extractData}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenInfo={() => setInfoOpen(true)}
        onCollapse={handleCollapse}
      />

      {/* 3 Dedicated Cupertino Tabs */}
      <NavSegment
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* ── 1. JOB DETAILS TAB ── */}
      {activeTab === 'job' && (
        <>
          {loading && <SkeletonLoader />}

          {!loading && error && (
            error.includes('reloaded') ? (
              <div className="empty-state">
                <div className="empty-card">
                  <div className="empty-icon-wrap">
                    <DocMagnifyingGlassIcon size={26} color="var(--apple-blue)" />
                  </div>
                  <h2 className="empty-title">Extension Updated</h2>
                  <p className="empty-subtitle">{error}</p>
                  <div className="empty-actions">
                    <button className="btn btn-filled" onClick={extractData}>
                      <ArrowClockwiseIcon size={14} color="#FFFFFF" />
                      <span>Retry Extraction</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="welcome-guide-card">
                <div className="welcome-header">
                  <BrandLogo size={46} className="welcome-logo-badge" />
                  <h2 className="welcome-title">Ready to Extract Jobs</h2>
                  <p className="welcome-desc">
                    Open any job posting on LinkedIn, Workday, Indeed, or career portals to extract clean details and calculate your ATS role fit.
                  </p>
                </div>

                <div className="welcome-steps-group">
                  <div className="welcome-step-item">
                    <span className="welcome-step-num">1</span>
                    <span className="welcome-step-text">
                      <strong>Open any Job Posting</strong>: Dedicated isolation for LinkedIn 2-pane search results, Workday, Indeed, and enterprise ATS pages.
                    </span>
                  </div>
                  <div className="welcome-step-item">
                    <span className="welcome-step-num">2</span>
                    <span className="welcome-step-text">
                      <strong>1-Click Clean Extraction</strong>: Strips navigation, ads, and search noise into formatted Markdown and AI-ready prompts.
                    </span>
                  </div>
                  <div className="welcome-step-item">
                    <span className="welcome-step-num">3</span>
                    <span className="welcome-step-text">
                      <strong>Instant ATS Role Fit</strong>: Scores technical skills and experience thresholds against your resume in under 2ms.
                    </span>
                  </div>
                </div>

                <div className="welcome-actions-row">
                  <button className="btn btn-filled" onClick={extractData}>
                    <ArrowClockwiseIcon size={14} color="#FFFFFF" />
                    <span>Check Active Page</span>
                  </button>
                  <button className="btn btn-tinted" onClick={handleOpenLinkedInJobs}>
                    <span>Open LinkedIn Jobs</span>
                    <ArrowUpRightIcon size={13} color="currentColor" />
                  </button>
                  <button className="btn btn-plain" onClick={() => setActiveTab('resume')}>
                    <PersonBadgeIcon size={14} color="var(--apple-blue)" />
                    <span>{resumeProfile ? 'Manage Resume Profile' : 'Upload Resume for ATS Scoring'}</span>
                  </button>
                  {historyItems.length > 0 && (
                    <button className="btn btn-plain" onClick={() => setHistoryOpen(true)}>
                      <ClockArrowIcon size={14} color="var(--apple-blue)" />
                      <span>View Saved Clips ({historyItems.length})</span>
                    </button>
                  )}
                </div>
              </div>
            )
          )}

          {!loading && !error && jobData && (
            <>
              <JobCard data={jobData} />

              <Preview text={jobData.description} />
              
              <PromptSelector
                activeMode={promptMode}
                onChangeMode={(mode) => {
                  setCustomGapPrompt(null);
                  setPromptMode(mode);
                }}
              />

              <ActionButtons
                onCopyAi={handleCopyAi}
                onCopyJd={handleCopyJd}
                onExportMd={handleExportMd}
              />

              <footer className="footer-meta">
                <span>© 2026 JD Extractor</span>
              </footer>
            </>
          )}
        </>
      )}

      {/* ── 2. ROLE FIT TAB ── */}
      {activeTab === 'fit' && (
        <>
          {loading && <FitSkeletonLoader />}

          {!loading && error && (
            <div className="empty-state">
              <div className="empty-card">
                <div className="empty-icon-wrap">
                  <DocMagnifyingGlassIcon size={26} color="var(--apple-blue)" />
                </div>
                <h2 className="empty-title">
                  {error.includes('reloaded') ? 'Extension Updated' : 'No Active Job Description'}
                </h2>
                <p className="empty-subtitle">{error}</p>
                <div className="empty-actions">
                  <button className="btn btn-filled" onClick={extractData}>
                    <ArrowClockwiseIcon size={14} color="#FFFFFF" />
                    <span>Retry Extraction</span>
                  </button>
                  <button className="btn btn-tinted" onClick={() => setActiveTab('resume')}>
                    <PersonBadgeIcon size={14} color="var(--apple-blue)" />
                    <span>{resumeProfile ? 'Manage My Resume' : 'Upload Resume'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <FitAnalysisCard
              jobData={jobData}
              resumeProfile={resumeProfile}
              onNavigateToResume={() => setActiveTab('resume')}
              onApplyGapTailoredPrompt={handleApplyGapTailoredPrompt}
              showToast={showToast}
            />
          )}
        </>
      )}

      {/* ── 3. MY RESUME TAB ── */}
      {activeTab === 'resume' && (
        <ResumeView
          resumeProfile={resumeProfile}
          onSaveResume={handleSaveResume}
          onDeleteResume={handleDeleteResume}
          onSwitchToFit={() => setActiveTab('fit')}
          showToast={showToast}
        />
      )}

      {/* Slide-over Sheets */}
      <HistorySheet
        isOpen={historyOpen}
        items={historyItems}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
        onClose={() => setHistoryOpen(false)}
      />

      <InfoSheet
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
      />

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Native Mobile-Style Launch Splash Screen ── */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </div>
  );
};
