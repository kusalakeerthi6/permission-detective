import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-logo-text">Permission Detective</span>
            <span className="footer-tag">Frontend Demo v1.0</span>
          </div>
          <p className="footer-desc">
            Empowering privacy auditors, mobile developers, and security analysts to surface
            discrepancies between application intent and operating system permission requests.
          </p>
        </div>

        <div className="footer-right">
          <div className="footer-meta-block">
            <span className="footer-meta-label">Evaluation Specimen</span>
            <span className="footer-meta-value">QuickCalc (com.fictional.quickcalc)</span>
          </div>
          <div className="footer-meta-block">
            <span className="footer-meta-label">Classification Scope</span>
            <span className="footer-meta-value">Explained • Unexplained • Uncertain • Conflicting</span>
          </div>
          <div className="footer-meta-block">
            <span className="footer-meta-label">Data Storage</span>
            <span className="footer-meta-value">Local In-Memory Demo (No External API/DB)</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copy">
          Designed for privacy intelligence research. An unexplained permission does not indicate confirmed malice.
        </p>
        <p className="footer-shortcuts">
          <kbd>Esc</kbd> to close inspection modals • Keyboard accessible navigation enabled
        </p>
      </div>
    </footer>
  );
}
