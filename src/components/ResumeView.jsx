import React, { useState, useRef } from 'react';
import {
  ArrowUpDocIcon,
  CheckmarkIcon,
  TrashIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  DocTextIcon,
  XMarkIcon,
  ArrowClockwiseIcon,
  BoltIcon,
} from './Icons';
import { extractTextFromFile } from '../utils/pdfExtractor.js';
import { parseResume } from '../utils/resumeParser.js';

export const ResumeView = ({
  resumeProfile,
  onSaveResume,
  onDeleteResume,
  onSwitchToFit,
  showToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const fileInputRef = useRef(null);

  // File drop & select handlers
  const handleFile = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const { text, fileName, fileSize } = await extractTextFromFile(file);
      const profile = parseResume(text, fileName, fileSize);
      await onSaveResume(profile);
      showToast('Resume parsed successfully');
    } catch (err) {
      console.error('[ResumeView] Parsing error:', err);
      showToast(err.message || 'Failed to parse resume file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!pasteText.trim()) return;

    setIsProcessing(true);
    try {
      const profile = parseResume(pasteText.trim(), 'Pasted Resume', pasteText.length);
      await onSaveResume(profile);
      setIsPasteOpen(false);
      setPasteText('');
      showToast('Resume text parsed successfully');
    } catch (err) {
      showToast(err.message || 'Failed to parse resume text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="resume-view-container">
      {/* ── 1. ACTIVE RESUME LOADED ── */}
      {resumeProfile ? (
        <div className="resume-active-wrapper">
          {/* Main Profile Header Card */}
          <div className="apple-card resume-profile-card">
            <div className="resume-card-header">
              <div className="resume-meta-left">
                <h2 className="candidate-name">{resumeProfile.candidateName || 'Candidate Profile'}</h2>
                <div className="resume-file-tag">
                  <DocTextIcon size={12} color="var(--apple-blue)" />
                  <span className="file-name">{resumeProfile.fileName}</span>
                  {resumeProfile.fileSize > 0 && (
                    <span className="file-size">· {formatFileSize(resumeProfile.fileSize)}</span>
                  )}
                </div>
              </div>
              <span className="apple-badge badge-accent">
                <CheckmarkIcon size={10} color="currentColor" />
                <span>Saved</span>
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="resume-metrics-grid">
              <div className="resume-metric-tile">
                <span className="metric-label">Experience</span>
                <span className="metric-value">
                  {resumeProfile.experienceYears > 0 ? `${resumeProfile.experienceYears} yrs` : 'Entry / Junior'}
                </span>
              </div>

              <div className="resume-metric-tile">
                <span className="metric-label">Skills Found</span>
                <span className="metric-value">{resumeProfile.skills?.length || 0}</span>
              </div>

              <div className="resume-metric-tile">
                <span className="metric-label">Updated</span>
                <span className="metric-value">{resumeProfile.updatedAt || 'Recent'}</span>
              </div>
            </div>

            {/* Target Role & Education */}
            <div className="resume-details-rows">
              {resumeProfile.roles?.length > 0 && (
                <div className="resume-detail-row">
                  <BriefcaseIcon size={13} color="var(--apple-blue)" />
                  <span className="detail-text">{resumeProfile.roles.join(', ')}</span>
                </div>
              )}

              {resumeProfile.education && resumeProfile.education !== 'Not explicitly listed' && (
                <div className="resume-detail-row">
                  <GraduationCapIcon size={13} color="var(--apple-blue)" />
                  <span className="detail-text">{resumeProfile.education}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recognized Skills Cloud */}
          <div className="apple-card resume-skills-card">
            <div className="card-subhead-row">
              <span className="card-subhead-title">Recognized Industry Skills ({resumeProfile.skills?.length || 0})</span>
            </div>
            
            {resumeProfile.skills?.length > 0 ? (
              <div className="skills-pill-wrap">
                {resumeProfile.skills.map((skill) => (
                  <span key={skill} className="skill-chip chip-neutral">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-inline-text">No technical skills detected. Check the text preview below.</p>
            )}
          </div>

          {/* Action Row */}
          <div className="resume-actions-row">
            <button
              className="btn btn-filled flex-1"
              onClick={onSwitchToFit}
            >
              <BoltIcon size={14} color="#FFFFFF" />
              <span>View Role Fit</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              title="Replace Resume"
            >
              <ArrowClockwiseIcon size={14} color="currentColor" />
              <span>Replace</span>
            </button>

            <button
              className="btn btn-icon-only btn-danger"
              onClick={onDeleteResume}
              title="Delete Resume"
            >
              <TrashIcon size={14} color="var(--apple-red)" />
            </button>
          </div>

          {/* Raw Text Accordion */}
          <div className="resume-accordion">
            <button
              type="button"
              className="resume-accordion-toggle"
              onClick={() => setShowFullText(!showFullText)}
            >
              <span>{showFullText ? 'Hide Extracted Text' : 'View Extracted Text'}</span>
              <span className="toggle-chevron">{showFullText ? '▲' : '▼'}</span>
            </button>
            {showFullText && (
              <div className="resume-raw-preview">
                <pre>{resumeProfile.rawText}</pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── 2. EMPTY STATE: RESUME UPLOAD DROPZONE ── */
        <div className="resume-upload-wrapper">
          <div
            className={`resume-dropzone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
          >
            <div className="dropzone-icon-circle">
              <ArrowUpDocIcon size={28} color="var(--apple-blue)" />
            </div>

            <h3 className="dropzone-title">
              {isProcessing ? 'Extracting & Parsing Resume...' : 'Drop your Resume here'}
            </h3>
            <p className="dropzone-subtitle">
              {isProcessing
                ? 'Recognizing technical skills and experience on-device...'
                : 'Supports PDF (.pdf) or Plain Text (.txt)'}
            </p>

            <button
              type="button"
              className="btn btn-filled dropzone-btn"
              disabled={isProcessing}
            >
              <span>Choose Resume File</span>
            </button>
          </div>

          <div className="paste-option-divider">
            <span className="divider-line" />
            <span className="divider-text">OR</span>
            <span className="divider-line" />
          </div>

          {!isPasteOpen ? (
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => setIsPasteOpen(true)}
            >
              <DocTextIcon size={14} color="currentColor" />
              <span>Paste Resume Text Manually</span>
            </button>
          ) : (
            <form onSubmit={handlePasteSubmit} className="paste-text-form">
              <div className="paste-form-header">
                <span className="paste-form-title">Paste Resume Text</span>
                <button
                  type="button"
                  className="btn-icon-subtle"
                  onClick={() => setIsPasteOpen(false)}
                >
                  <XMarkIcon size={13} color="currentColor" />
                </button>
              </div>
              <textarea
                className="paste-textarea"
                rows={7}
                placeholder="Paste the full text of your resume (experience, education, skills, projects)..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                autoFocus
              />
              <div className="paste-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPasteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-filled"
                  disabled={!pasteText.trim() || isProcessing}
                >
                  <CheckmarkIcon size={14} color="#FFFFFF" />
                  <span>Parse & Save</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,text/plain,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
          e.target.value = '';
        }}
      />
    </div>
  );
};
