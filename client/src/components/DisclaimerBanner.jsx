import React, { useState } from 'react';
import { METHODOLOGY_DISCLAIMER, CLASSIFICATION_META } from '../data/mockAppData';

export default function DisclaimerBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="disclaimer-banner" aria-label="Privacy Intelligence and Methodology Notice">
      <div className="disclaimer-card">
        <div className="disclaimer-header">
          <div className="disclaimer-icon-col" aria-hidden="true">
            <span className="info-icon">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
          </div>

          <div className="disclaimer-content">
            <div className="disclaimer-title-row">
              <h2 className="disclaimer-title">{METHODOLOGY_DISCLAIMER.title}</h2>
              <span className="disclaimer-tag">Core Privacy Principle</span>
            </div>
            <p className="disclaimer-summary">
              <strong>Crucial Distinction:</strong> An <em>Unexplained</em> or <em>Conflicting</em> permission
              indicates a discrepancy between declared application features and requested OS capabilities.
              It <strong>does not prove malicious activity</strong> or active surveillance.
            </p>
          </div>

          <div className="disclaimer-action">
            <button
              type="button"
              className="toggle-methodology-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="methodology-details"
            >
              {isExpanded ? 'Hide Methodology' : 'View Methodology'}
              <svg
                className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div id="methodology-details" className="methodology-expanded">
            <p className="methodology-text">{METHODOLOGY_DISCLAIMER.details}</p>

            <div className="category-legend-grid">
              {Object.entries(CLASSIFICATION_META).map(([key, meta]) => (
                <div
                  key={key}
                  className="legend-card"
                  style={{
                    backgroundColor: meta.bgColor,
                    borderColor: meta.borderColor,
                  }}
                >
                  <div className="legend-badge" style={{ color: meta.color }}>
                    <span className="dot" style={{ backgroundColor: meta.color }} />
                    {meta.label}
                  </div>
                  <p className="legend-desc">{meta.description}</p>
                </div>
              ))}
            </div>

            <div className="methodology-footer-note">
              <span>💡 Common benign causes of unexplained permissions:</span>
              <ul>
                <li>Third-party analytics or ad mediation libraries bundled without developer awareness</li>
                <li>Legacy manifest entries retained across Android SDK version upgrades</li>
                <li>Unreleased prototype features or debug testing code left in manifest</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
