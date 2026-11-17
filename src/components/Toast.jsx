import React from 'react';
import { CheckmarkCircleIcon } from './Icons';

export const Toast = ({ message, visible }) => {
  return (
    <div className={`toast-capsule ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
      <CheckmarkCircleIcon size={15} color="var(--status-success-text)" />
      <span>{message}</span>
    </div>
  );
};
