import React, { useState } from 'react';

export default function RealApkOverview({ apkData }) {
  const [copiedSha, setCopiedSha] = useState(false);

  if (!apkData) return null;

  const { app, file, stats, extractedAt } = apkData;

  const handleCopySha = () => {
    navigator.clipboard.writeText(file.sha256).then(() => {
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    });
  };

  return (
    <section className="app-overview-section" aria-label="Real APK Specimen Overview">
      <div className="overview-card real-apk-card">
        {/* App Meta Header */}
        <div className="app-header-row">
          <div className="app-identity">
            <div className="app-icon real-icon" aria-hidden="true">
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <div className="app-title-block">
              <div className="app-title-line">
                <h2 className="app-name">{app.name}</h2>
                <span className="app-version-badge">
                  {app.versionName} {app.versionCode ? `(${app.versionCode})` : ''}
                </span>
                <span className="real-specimen-tag">Real APK Manifest Specimen</span>
              </div>
              <p className="app-tagline">Package: <code>{app.packageName}</code></p>
              <div className="app-metadata-chips">
                <span className="meta-chip">
                  <span className="chip-key">File:</span>
                  <span className="chip-val">{file.originalName}</span>
                </span>
                <span className="meta-chip">
                  <span className="chip-key">Size:</span>
                  <span className="chip-val">{file.sizeFormatted}</span>
                </span>
                <span className="meta-chip">
                  <span className="chip-key">Target SDK:</span>
                  <span className="chip-val">{app.targetSdk}</span>
                </span>
                <span className="meta-chip">
                  <span className="chip-key">Min SDK:</span>
                  <span className="chip-val">{app.minSdk}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="apk-fingerprint-box">
            <div className="fingerprint-label">SHA-256 Digest</div>
            <div className="fingerprint-row">
              <code className="fingerprint-hash" title={file.sha256}>
                {file.sha256.substring(0, 20)}...
              </code>
              <button
                type="button"
                className="copy-sha-btn"
                onClick={handleCopySha}
                title="Copy full SHA-256 hash"
              >
                {copiedSha ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="fingerprint-sub">
              Extracted at {new Date(extractedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Fact-based Notice Box */}
        <div className="fact-notice-box">
          <div className="fact-notice-header">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <h3 className="fact-notice-title">Factual Manifest Declaration Notice</h3>
          </div>
          <p className="fact-notice-text">
            These permissions represent capabilities declared in the uploaded APK's <code>AndroidManifest.xml</code>.
            Declared permissions alone do not establish runtime behavior, background activity, or malicious intent.
            Permissions may be dormant, requested by third-party libraries, or reserved for optional user features.
          </p>
        </div>

        {/* Manifest Declared Components Breakdown */}
        {app.componentCounts && (
          <div className="manifest-components-grid">
            <div className="component-stat-card">
              <span className="component-count">{app.componentCounts.activities}</span>
              <span className="component-name">Activities</span>
              <span className="component-desc">UI screens declared</span>
            </div>
            <div className="component-stat-card">
              <span className="component-count">{app.componentCounts.services}</span>
              <span className="component-name">Services</span>
              <span className="component-desc">Background workers</span>
            </div>
            <div className="component-stat-card">
              <span className="component-count">{app.componentCounts.receivers}</span>
              <span className="component-name">Receivers</span>
              <span className="component-desc">Broadcast listeners</span>
            </div>
            <div className="component-stat-card">
              <span className="component-count">{app.componentCounts.providers}</span>
              <span className="component-name">Providers</span>
              <span className="component-desc">Data sharing hooks</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
