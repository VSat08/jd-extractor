import React, { useState } from 'react';
import {
  DocOnClipboardIcon,
  DocPlaintextIcon,
  ArrowDownDocIcon,
  CheckmarkIcon,
} from './Icons';

export const ActionButtons = ({ onCopyAi, onCopyJd, onExportMd }) => {
  const [flashAi, setFlashAi] = useState(false);
  const [flashJd, setFlashJd] = useState(false);

  const handleCopyAi = async () => {
    const ok = await onCopyAi();
    if (ok) {
      setFlashAi(true);
      setTimeout(() => setFlashAi(false), 1600);
    }
  };

  const handleCopyJd = async () => {
    const ok = await onCopyJd();
    if (ok) {
      setFlashJd(true);
      setTimeout(() => setFlashJd(false), 1600);
    }
  };

  return (
    <div className="action-group">
      <div className="button-row">
        <button
          className={`btn btn-filled ${flashAi ? 'btn-flash' : ''}`}
          onClick={handleCopyAi}
        >
          {flashAi ? (
            <>
              <CheckmarkIcon size={14} color="#FFFFFF" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <DocOnClipboardIcon size={14} />
              <span>Copy for AI</span>
            </>
          )}
        </button>

        <button
          className={`btn btn-tinted ${flashJd ? 'btn-flash' : ''}`}
          onClick={handleCopyJd}
        >
          {flashJd ? (
            <>
              <CheckmarkIcon size={14} color="#FFFFFF" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <DocPlaintextIcon size={14} />
              <span>Copy Raw JD</span>
            </>
          )}
        </button>
      </div>

      <button className="btn btn-plain" onClick={onExportMd}>
        <ArrowDownDocIcon size={14} />
        <span>Save as Markdown (.md)</span>
      </button>
    </div>
  );
};
