import React, { useEffect, useState } from 'react';
import { CLASSIFICATION_META } from '../data/mockAppData';

export default function PermissionDetailModal({ permission, onClose, packageName = 'com.fictional.quickcalc' }) {
  const [completedChecks, setCompletedChecks] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!permission) return null;

  const hasClassification = Boolean(permission.classification);
  const isHighRisk = permission.riskLevel && permission.riskLevel.toLowerCase().includes('high');
  const meta = hasClassification
    ? CLASSIFICATION_META[permission.classification] || {}
    : {
        color: isHighRisk ? '#f43f5e' : '#10b981',
        bgColor: isHighRisk ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
        borderColor: isHighRisk ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)',
      };

  const toggleCheck = (idx) => {
    setCompletedChecks((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const xmlSnippet = `<!-- AndroidManifest.xml extraction -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}">

    <!-- Extracted Permission Declaration -->
    <uses-permission android:name="${permission.permissionKey}" />

    <application
        android:label="Target Application">
        <!-- Component hooks related to ${permission.name} -->
    </application>
</manifest>`;

  const recommendedChecks = Array.isArray(permission.recommendedChecks) ? permission.recommendedChecks : [];
  const evidenceList = Array.isArray(permission.evidence) ? permission.evidence : [];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-perm-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--modal-accent': meta.color,
          '--modal-accent-bg': meta.bgColor,
        }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-category-group">
              <span>{permission.group || permission.categoryGroup || 'Android System'}</span>
              <span className="dot-divider">•</span>
              <span>{permission.protectionLevel || permission.riskLevel || 'Declared Capability'}</span>
            </div>
            <h2 id="modal-perm-title" className="modal-title">
              {permission.name}
            </h2>
            <code className="modal-key-code">{permission.permissionKey}</code>
          </div>

          <div className="modal-header-actions">
            <span
              className="modal-classification-badge"
              style={{
                backgroundColor: meta.bgColor,
                borderColor: meta.borderColor,
                color: meta.color,
              }}
            >
              {hasClassification ? permission.classification : (isHighRisk ? 'Dangerous / Runtime' : 'Normal / Install')}
            </span>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close details modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Section: Comprehensive Explanation / Capability Description */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              {hasClassification ? 'Forensic Privacy Assessment' : 'Android Framework Capability Scope'}
            </h3>
            <p className="modal-paragraph">
              {permission.explanation || permission.description}
            </p>
          </div>

          {/* Section: Raw Manifest Code Snippet */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Manifest XML Declaration
            </h3>
            <div className="code-viewer-block">
              <div className="code-viewer-bar">
                <span className="code-lang-label">XML / AndroidManifest.xml</span>
                <span className="code-status-pill">Extracted Specimen</span>
              </div>
              <pre className="code-pre">
                <code>{xmlSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Section: Interactive Auditor Verification Checklist */}
          {recommendedChecks.length > 0 && (
            <div className="modal-section">
              <div className="checklist-title-row">
                <h3 className="modal-section-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Auditor Triage & Verification Checklist
                </h3>
                <span className="checklist-hint">Interactive Triage Tool</span>
              </div>

              <div className="interactive-checklist">
                {recommendedChecks.map((check, idx) => {
                  const isChecked = !!completedChecks[idx];
                  return (
                    <label
                      key={idx}
                      className={`checklist-item ${isChecked ? 'completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="checklist-checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(idx)}
                      />
                      <div className="checklist-text-wrap">
                        <span className="check-index-tag">Step {idx + 1}</span>
                        <span className="checklist-desc">{check}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Technical Evidence Breakdown (if present) */}
          {evidenceList.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Collected Evidence Points
              </h3>
              <div className="modal-evidence-grid">
                {evidenceList.map((ev, idx) => (
                  <div key={idx} className="modal-evidence-card">
                    <span className="evidence-idx-badge">Evidence #{idx + 1}</span>
                    <p className="evidence-body">{ev}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-note">
            Target Specimen: <code>{packageName}</code> • Permission Detective Engine
          </div>
          <button
            type="button"
            className="modal-done-btn"
            onClick={onClose}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
