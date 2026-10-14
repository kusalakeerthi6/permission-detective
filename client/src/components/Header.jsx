import React from 'react';

export default function Header({ onResetFilters, activeMode = 'demo', realAppName }) {
  const isReal = activeMode === 'real';

  return (
    <header className="site-header" role="banner">
      <div className="header-container">
        <div className="brand-group">
          <div className="logo-icon-wrapper" aria-hidden="true">
            <svg
              className="logo-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="11" cy="10" r="3" strokeWidth="2" />
              <path d="M13.5 12.5L16 15" strokeWidth="2" />
            </svg>
            <span className="pulse-beacon" />
          </div>

          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">Permission Detective</h1>
              {isReal ? (
                <span className="demo-badge real-apk-badge" aria-label="Real APK Audit Mode">
                  <span className="demo-dot real-dot" />
                  REAL APK MANIFEST AUDIT
                </span>
              ) : (
                <span className="demo-badge" aria-label="Demo Mode Indicator">
                  <span className="demo-dot" />
                  DEMO EVALUATION
                </span>
              )}
            </div>
            <p className="brand-subtitle">
              Automated Mobile Privacy Audit & Discrepancy Analyzer
            </p>
          </div>
        </div>

        <div className="header-meta">
          <div className="meta-pill">
            <span className="meta-label">Active Specimen</span>
            <span className="meta-value">
              {isReal ? (realAppName || 'Real APK Package') : 'QuickCalc v2.4.1'}
            </span>
          </div>
          <div className="meta-pill status-ready">
            <span className="status-indicator-dot" />
            <span className="meta-value">{isReal ? 'Live Manifest Extracted' : 'Audit Complete'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
