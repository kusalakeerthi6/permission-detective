import React, { useState } from 'react';
import { CLASSIFICATION_META } from '../data/mockAppData';

export default function PermissionCard({ permission, onInspect, mode = 'demo' }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('explanation'); // 'explanation' | 'evidence' | 'checks'

  const hasClassification = Boolean(permission.classification);
  const isHighRisk = permission.riskLevel && permission.riskLevel.toLowerCase().includes('high');
  const isNormalRisk = permission.riskLevel && permission.riskLevel.toLowerCase().includes('normal');
  const isSpecialRisk = permission.riskLevel && (permission.riskLevel.toLowerCase().includes('special') || permission.riskLevel.toLowerCase().includes('signature'));

  const accentColor = hasClassification
    ? CLASSIFICATION_META[permission.classification]?.color || '#38bdf8'
    : isHighRisk
    ? '#f43f5e'
    : isNormalRisk
    ? '#10b981'
    : isSpecialRisk
    ? '#a855f7'
    : '#f59e0b';

  const accentBg = `${accentColor}18`;
  const accentBorder = `${accentColor}40`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(permission.permissionKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasEvidence = Array.isArray(permission.evidence) && permission.evidence.length > 0;
  const recommendedChecks = Array.isArray(permission.recommendedChecks) ? permission.recommendedChecks : [];

  return (
    <article
      className="permission-card"
      style={{
        '--card-accent': accentColor,
        '--card-accent-bg': accentBg,
        '--card-accent-border': accentBorder,
      }}
      aria-labelledby={`perm-title-${permission.id}`}
    >
      {/* Top Banner Bar */}
      <div className="card-top-bar">
        <div className="card-top-left">
          <span className="group-label">
            <svg
              className="group-icon"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
            {permission.group || permission.categoryGroup || 'General Permission'}
          </span>
          <span className={`risk-badge ${isHighRisk ? 'risk-high' : 'risk-normal'}`}>
            {permission.riskLevel || (isHighRisk ? 'High Risk' : 'Normal Risk')}
          </span>
        </div>

        {/* Classification or Extraction Badge */}
        {hasClassification ? (
          <div
            className="classification-badge"
            style={{
              backgroundColor: CLASSIFICATION_META[permission.classification]?.bgColor,
              borderColor: CLASSIFICATION_META[permission.classification]?.borderColor,
              color: CLASSIFICATION_META[permission.classification]?.color,
            }}
          >
            <span
              className="status-dot"
              style={{ backgroundColor: CLASSIFICATION_META[permission.classification]?.color }}
            />
            <strong>{permission.classification}</strong>
          </div>
        ) : (
          <div
            className="classification-badge real-manifest-badge"
            style={{
              backgroundColor: accentBg,
              borderColor: accentBorder,
              color: accentColor,
            }}
          >
            <span className="status-dot" style={{ backgroundColor: accentColor }} />
            <strong>{permission.isCustom ? 'Custom Permission' : 'Declared in Manifest'}</strong>
          </div>
        )}
      </div>

      {/* Permission Identifier */}
      <div className="card-identity-row">
        <div className="permission-name-group">
          <h3 id={`perm-title-${permission.id}`} className="permission-name">
            {permission.name}
          </h3>
          <div className="key-copy-container">
            <code className="permission-key">{permission.permissionKey}</code>
            <button
              type="button"
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              aria-label={`Copy full permission key ${permission.permissionKey}`}
              title="Copy Android permission identifier"
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="protection-tier">
          <span className="protection-label">
            {permission.protectionLevel || (isHighRisk ? 'Dangerous (Runtime)' : 'Normal (Install-time)')}
          </span>
        </div>
      </div>

      {/* Summary / Description */}
      <p className="permission-summary">
        {permission.summary || permission.description}
      </p>

      {/* Tabs navigation for deep sections */}
      <div className="card-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'explanation'}
          className={`card-tab-btn ${activeTab === 'explanation' ? 'active' : ''}`}
          onClick={() => setActiveTab('explanation')}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {hasClassification ? 'Explanation & Context' : 'Capability Details'}
        </button>

        {hasEvidence && (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'evidence'}
            className={`card-tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            Technical Evidence ({permission.evidence.length})
          </button>
        )}

        {recommendedChecks.length > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'checks'}
            className={`card-tab-btn ${activeTab === 'checks' ? 'active' : ''}`}
            onClick={() => setActiveTab('checks')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Recommended Checks ({recommendedChecks.length})
          </button>
        )}
      </div>

      {/* Tab Content Display */}
      <div className="tab-panel-container">
        {activeTab === 'explanation' && (
          <div className="tab-pane pane-explanation">
            <div className="pane-header">
              <span className="pane-title">
                {hasClassification ? 'Why This Classification?' : 'Framework Capability Assessment'}
              </span>
              <span
                className="classification-pill-mini"
                style={{ color: accentColor, borderColor: accentBorder }}
              >
                {permission.classification || (isHighRisk ? 'High Risk' : 'Standard')}
              </span>
            </div>
            <p className="pane-narrative">
              {permission.explanation || permission.description}
            </p>
          </div>
        )}

        {activeTab === 'evidence' && hasEvidence && (
          <div className="tab-pane pane-evidence">
            <div className="pane-header">
              <span className="pane-title">Artifact & Forensic Traces</span>
              <span className="evidence-badge">{permission.evidence.length} Points Found</span>
            </div>
            <ul className="evidence-list">
              {permission.evidence.map((item, idx) => (
                <li key={idx} className="evidence-item">
                  <span className="bullet-indicator" />
                  <span className="evidence-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'checks' && (
          <div className="tab-pane pane-checks">
            <div className="pane-header">
              <span className="pane-title">Auditor Verification & Remediation Actions</span>
              <span className="checks-badge">Triage Action Items</span>
            </div>
            <ul className="checks-list">
              {recommendedChecks.map((check, idx) => (
                <li key={idx} className="check-item">
                  <span className="check-number">#{idx + 1}</span>
                  <span className="check-text">{check}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Tags & Action Bar */}
      <div className="card-footer-row">
        <div className="card-tags">
          {permission.tags ? (
            permission.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
              </span>
            ))
          ) : (
            <>
              <span className="tag-chip">#{permission.group || 'ManifestPermission'}</span>
              <span className="tag-chip">#{isHighRisk ? 'DangerousAPI' : 'InstallTime'}</span>
            </>
          )}
        </div>

        <button
          type="button"
          className="inspect-card-btn"
          onClick={() => onInspect(permission)}
          aria-label={`Open detailed audit modal for ${permission.name}`}
        >
          <span>Deep Audit</span>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}
