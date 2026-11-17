import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/apple-theme.css';

// Global error handler to catch Chromium extension context invalidation
// (Occurs when an extension is reloaded while the side panel or tab was active)
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('Extension context invalidated') ||
    event.reason?.message?.includes('context invalidated')
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (
    event.message?.includes('Extension context invalidated') ||
    event.message?.includes('context invalidated')
  ) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
