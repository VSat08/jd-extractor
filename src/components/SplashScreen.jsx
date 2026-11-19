import React, { useState, useEffect } from 'react';
import { BrandLogo } from './Icons';

export const SplashScreen = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Display splash for 1500ms (1.5s), then trigger 400ms smooth Apple crossfade
    const holdTimer = setTimeout(() => {
      setFading(true);
    }, 1500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1900);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fading ? 'splash-fading' : ''}`} aria-hidden={fading}>
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <BrandLogo size={76} />
        </div>
        
        <div className="splash-text-wrap">
          <h1 className="splash-title">JD Extractor</h1>
          <p className="splash-subtitle">Job Description & ATS Resume Matcher</p>
        </div>

        <div className="splash-loader-wrap">
          <div className="splash-spinner" />
          <span className="splash-loading-label">Connecting to browser tab...</span>
        </div>
      </div>

      <div className="splash-footer">
        <span>© 2026 JD Extractor</span>
      </div>
    </div>
  );
};
