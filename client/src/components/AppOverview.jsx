import React from 'react';
import { QUICKCALC_APP_DATA } from '../data/mockAppData';

export default function AppOverview() {
  const app = QUICKCALC_APP_DATA;

  return (
    <section className="app-overview-section" aria-label="Target Specimen Overview">
      <div className="overview-card">
        {/* App Meta Header */}
        <div className="app-header-row">
          <div className="app-identity">
            <div className="app-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                stroke="currentColor"
                strokeWidth="1.75"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="16" y1="14" x2="16" y2="18" />
                <path d="M16 10h.01" />
                <path d="M12 10h.01" />
                <path d="M8 10h.01" />
                <path d="M12 14h.01" />
                <path d="M8 14h.01" />
                <path d="M12 18h.01" />
                <path d="M8 18h.01" />
              </svg>
            </div>

            <div className="app-title-block">
              <div className="app-title-line">
                <h2 className="app-name">{app.name}</h2>
                <span className="app-version-badge">{app.version}</span>
                <span className="specimen-tag">Fictional Audit Target</span>
              </div>
              <p className="app-tagline">{app.tagline}</p>
              <div className="app-metadata-chips">
                <span className="meta-chip">
                  <span className="chip-key">Package:</span>
                  <code className="chip-val">{app.packageName}</code>
                </span>
                <span className="meta-chip">
                  <span className="chip-key">Developer:</span>
                  <span className="chip-val">{app.developer}</span>
                </span>
                <span className="meta-chip">
                  <span className="chip-key">Category:</span>
                  <span className="chip-val">{app.category}</span>
                </span>
                <span className="meta-chip">
                  <span className="chip-key">Target SDK:</span>
                  <span className="chip-val">{app.targetSdk}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="risk-rating-badge">
            <div className="risk-level-label">Risk Profile</div>
            <div className="risk-level-status">
              <span className="warning-dot" />
              {app.overallRiskLevel}
            </div>
            <div className="risk-subtitle">3 Dangerous Permissions Found</div>
          </div>
        </div>

        {/* Purpose Callout */}
        <div className="purpose-box">
          <div className="purpose-header">
            <svg
              className="purpose-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <h3 className="purpose-title">Stated Application Purpose</h3>
          </div>
          <p className="purpose-text">"{app.purpose}"</p>
        </div>

        {/* Declared Features */}
        <div className="features-container">
          <div className="features-header-row">
            <h3 className="section-subtitle">
              Declared Functional Features ({app.features.length})
            </h3>
            <span className="features-note">
              Extracted from official store listings and in-app user guide
            </span>
          </div>

          <div className="features-grid">
            {app.features.map((feature, idx) => (
              <div key={feature.id} className="feature-item-card">
                <div className="feature-item-top">
                  <span className="feature-index">0{idx + 1}</span>
                  <span className="feature-badge">{feature.badge}</span>
                </div>
                <h4 className="feature-item-title">{feature.title}</h4>
                <p className="feature-item-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
