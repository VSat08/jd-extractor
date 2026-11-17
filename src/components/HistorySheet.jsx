import React from 'react';
import {
  XMarkIcon,
  TrashIcon,
  ChevronRightSmallIcon,
  ClockArrowIcon,
} from './Icons';

export const HistorySheet = ({ isOpen, items, onSelect, onClear, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="sheet-overlay">
      <div className="sheet-header">
        <h2 className="sheet-title">Recent Clips</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {items.length > 0 && (
            <button className="btn btn-plain" onClick={onClear} style={{ padding: '4px 8px', gap: '4px' }}>
              <TrashIcon size={12} />
              <span>Clear</span>
            </button>
          )}
          <button className="icon-btn" onClick={onClose} aria-label="Close history">
            <XMarkIcon size={13} />
          </button>
        </div>
      </div>

      <div className="history-list">
        {items.length === 0 ? (
          <div className="empty-state">
            <ClockArrowIcon size={36} color="var(--text-3)" />
            <span className="empty-title">No Clips Yet</span>
            <span className="empty-subtitle">
              Extracted job descriptions will automatically be saved here.
            </span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="history-card"
              onClick={() => onSelect(item.data)}
            >
              <div className="hist-content">
                <div className="hist-title">{item.title}</div>
                <div className="hist-meta">{item.company} · {item.date}</div>
              </div>
              <span className="hist-chevron">
                <ChevronRightSmallIcon size={13} color="var(--text-3)" />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
