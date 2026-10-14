import React from 'react';
import { CLASSIFICATION_TYPES, CLASSIFICATION_META } from '../data/mockAppData';

export default function StatsBar({
  permissions = [],
  activeClassification,
  onSelectClassification,
  mode = 'demo', // 'demo' | 'real'
  riskFilter = 'ALL',
  onSelectRiskFilter,
}) {
  const totalCount = permissions.length;

  if (mode === 'real') {
    // Real APK stats breakdown
    const dangerousCount = permissions.filter(
      (p) => p.riskLevel && p.riskLevel.toLowerCase().includes('high')
    ).length;
    const normalCount = permissions.filter(
      (p) => p.riskLevel && p.riskLevel.toLowerCase().includes('normal')
    ).length;
    const specialCount = permissions.filter(
      (p) => p.riskLevel && (p.riskLevel.toLowerCase().includes('special') || p.riskLevel.toLowerCase().includes('signature'))
    ).length;
    const customCount = permissions.filter((p) => p.isCustom).length;

    return (
      <section className="stats-section" aria-label="Extracted Manifest Permissions Statistics">
        <div className="stats-grid">
          {/* Total Stat Card */}
          <button
            type="button"
            className={`stat-card total-card ${riskFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectRiskFilter && onSelectRiskFilter('ALL')}
            aria-pressed={riskFilter === 'ALL'}
            title="Show all extracted permissions"
          >
            <div className="stat-card-header">
              <span className="stat-label">Total Extracted</span>
              <span className="stat-pill-mini">Real Manifest</span>
            </div>
            <div className="stat-numeric-row">
              <span className="stat-number">{totalCount}</span>
              <span className="stat-unit">Permissions</span>
            </div>
            <div className="stat-footer-text">Declared in AndroidManifest.xml</div>
          </button>

          {/* Dangerous / High Risk */}
          <button
            type="button"
            className={`stat-card stat-unexplained ${riskFilter === 'HIGH' ? 'active' : ''}`}
            onClick={() => onSelectRiskFilter && onSelectRiskFilter(riskFilter === 'HIGH' ? 'ALL' : 'HIGH')}
            aria-pressed={riskFilter === 'HIGH'}
            title="Filter High Risk / Dangerous runtime permissions"
          >
            <div className="stat-card-header">
              <span className="stat-label">Dangerous / Runtime</span>
              <span className="stat-indicator-dot" style={{ backgroundColor: '#f43f5e' }} />
            </div>
            <div className="stat-numeric-row">
              <span className="stat-number" style={{ color: '#f43f5e' }}>
                {dangerousCount}
              </span>
              <span className="stat-pct">
                ({totalCount > 0 ? Math.round((dangerousCount / totalCount) * 100) : 0}%)
              </span>
            </div>
            <div className="stat-footer-text">Prompts user at runtime (Camera, GPS, Contacts)</div>
          </button>

          {/* Normal / Install-time */}
          <button
            type="button"
            className={`stat-card stat-explained ${riskFilter === 'NORMAL' ? 'active' : ''}`}
            onClick={() => onSelectRiskFilter && onSelectRiskFilter(riskFilter === 'NORMAL' ? 'ALL' : 'NORMAL')}
            aria-pressed={riskFilter === 'NORMAL'}
            title="Filter Normal / Install-time permissions"
          >
            <div className="stat-card-header">
              <span className="stat-label">Normal / Install</span>
              <span className="stat-indicator-dot" style={{ backgroundColor: '#10b981' }} />
            </div>
            <div className="stat-numeric-row">
              <span className="stat-number" style={{ color: '#10b981' }}>
                {normalCount}
              </span>
              <span className="stat-pct">
                ({totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0}%)
              </span>
            </div>
            <div className="stat-footer-text">Granted automatically upon install (e.g. Internet)</div>
          </button>

          {/* Special / System */}
          <button
            type="button"
            className={`stat-card stat-conflicting ${riskFilter === 'SPECIAL' ? 'active' : ''}`}
            onClick={() => onSelectRiskFilter && onSelectRiskFilter(riskFilter === 'SPECIAL' ? 'ALL' : 'SPECIAL')}
            aria-pressed={riskFilter === 'SPECIAL'}
            title="Filter Special App Access permissions"
          >
            <div className="stat-card-header">
              <span className="stat-label">Special Access</span>
              <span className="stat-indicator-dot" style={{ backgroundColor: '#a855f7' }} />
            </div>
            <div className="stat-numeric-row">
              <span className="stat-number" style={{ color: '#a855f7' }}>
                {specialCount}
              </span>
              <span className="stat-pct">
                ({totalCount > 0 ? Math.round((specialCount / totalCount) * 100) : 0}%)
              </span>
            </div>
            <div className="stat-footer-text">Special permissions (e.g. System Alert, Install)</div>
          </button>

          {/* Custom / Third-party */}
          <button
            type="button"
            className={`stat-card stat-uncertain ${riskFilter === 'CUSTOM' ? 'active' : ''}`}
            onClick={() => onSelectRiskFilter && onSelectRiskFilter(riskFilter === 'CUSTOM' ? 'ALL' : 'CUSTOM')}
            aria-pressed={riskFilter === 'CUSTOM'}
            title="Filter Custom or OEM permissions"
          >
            <div className="stat-card-header">
              <span className="stat-label">Custom / OEM</span>
              <span className="stat-indicator-dot" style={{ backgroundColor: '#f59e0b' }} />
            </div>
            <div className="stat-numeric-row">
              <span className="stat-number" style={{ color: '#f59e0b' }}>
                {customCount}
              </span>
              <span className="stat-pct">
                ({totalCount > 0 ? Math.round((customCount / totalCount) * 100) : 0}%)
              </span>
            </div>
            <div className="stat-footer-text">Defined by app developer or device vendor</div>
          </button>
        </div>
      </section>
    );
  }

  // Demo mode: 4 classification categories
  const counts = {
    [CLASSIFICATION_TYPES.EXPLAINED]: permissions.filter(
      (p) => p.classification === CLASSIFICATION_TYPES.EXPLAINED
    ).length,
    [CLASSIFICATION_TYPES.UNEXPLAINED]: permissions.filter(
      (p) => p.classification === CLASSIFICATION_TYPES.UNEXPLAINED
    ).length,
    [CLASSIFICATION_TYPES.UNCERTAIN]: permissions.filter(
      (p) => p.classification === CLASSIFICATION_TYPES.UNCERTAIN
    ).length,
    [CLASSIFICATION_TYPES.CONFLICTING]: permissions.filter(
      (p) => p.classification === CLASSIFICATION_TYPES.CONFLICTING
    ).length,
  };

  const dangerousCount = permissions.filter((p) =>
    p.riskLevel && p.riskLevel.toLowerCase().includes('high')
  ).length;

  return (
    <section className="stats-section" aria-label="Permission Audit Summary Statistics">
      <div className="stats-grid">
        {/* Total Stat Card */}
        <button
          type="button"
          className={`stat-card total-card ${activeClassification === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectClassification('ALL')}
          aria-pressed={activeClassification === 'ALL'}
          title="Click to show all permissions"
        >
          <div className="stat-card-header">
            <span className="stat-label">Total Analyzed</span>
            <span className="stat-pill-mini">APK Scope</span>
          </div>
          <div className="stat-numeric-row">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-unit">Permissions</span>
          </div>
          <div className="stat-footer-text">
            <span>{dangerousCount} Dangerous / Runtime</span>
          </div>
        </button>

        {/* Explained Card */}
        <button
          type="button"
          className={`stat-card stat-explained ${
            activeClassification === CLASSIFICATION_TYPES.EXPLAINED ? 'active' : ''
          }`}
          onClick={() =>
            onSelectClassification(
              activeClassification === CLASSIFICATION_TYPES.EXPLAINED
                ? 'ALL'
                : CLASSIFICATION_TYPES.EXPLAINED
            )
          }
          aria-pressed={activeClassification === CLASSIFICATION_TYPES.EXPLAINED}
          title="Click to filter Explained permissions"
        >
          <div className="stat-card-header">
            <span className="stat-label">Explained</span>
            <span
              className="stat-indicator-dot"
              style={{ backgroundColor: CLASSIFICATION_META[CLASSIFICATION_TYPES.EXPLAINED]?.color }}
            />
          </div>
          <div className="stat-numeric-row">
            <span
              className="stat-number"
              style={{ color: CLASSIFICATION_META[CLASSIFICATION_TYPES.EXPLAINED]?.color }}
            >
              {counts[CLASSIFICATION_TYPES.EXPLAINED] || 0}
            </span>
            <span className="stat-pct">
              ({totalCount > 0 ? Math.round(((counts[CLASSIFICATION_TYPES.EXPLAINED] || 0) / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="stat-footer-text">Directly justified by features</div>
        </button>

        {/* Unexplained Card */}
        <button
          type="button"
          className={`stat-card stat-unexplained ${
            activeClassification === CLASSIFICATION_TYPES.UNEXPLAINED ? 'active' : ''
          }`}
          onClick={() =>
            onSelectClassification(
              activeClassification === CLASSIFICATION_TYPES.UNEXPLAINED
                ? 'ALL'
                : CLASSIFICATION_TYPES.UNEXPLAINED
            )
          }
          aria-pressed={activeClassification === CLASSIFICATION_TYPES.UNEXPLAINED}
          title="Click to filter Unexplained permissions"
        >
          <div className="stat-card-header">
            <span className="stat-label">Unexplained</span>
            <span
              className="stat-indicator-dot"
              style={{ backgroundColor: CLASSIFICATION_META[CLASSIFICATION_TYPES.UNEXPLAINED]?.color }}
            />
          </div>
          <div className="stat-numeric-row">
            <span
              className="stat-number"
              style={{ color: CLASSIFICATION_META[CLASSIFICATION_TYPES.UNEXPLAINED]?.color }}
            >
              {counts[CLASSIFICATION_TYPES.UNEXPLAINED] || 0}
            </span>
            <span className="stat-pct">
              ({totalCount > 0 ? Math.round(((counts[CLASSIFICATION_TYPES.UNEXPLAINED] || 0) / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="stat-footer-text">Zero apparent justification</div>
        </button>

        {/* Uncertain Card */}
        <button
          type="button"
          className={`stat-card stat-uncertain ${
            activeClassification === CLASSIFICATION_TYPES.UNCERTAIN ? 'active' : ''
          }`}
          onClick={() =>
            onSelectClassification(
              activeClassification === CLASSIFICATION_TYPES.UNCERTAIN
                ? 'ALL'
                : CLASSIFICATION_TYPES.UNCERTAIN
            )
          }
          aria-pressed={activeClassification === CLASSIFICATION_TYPES.UNCERTAIN}
          title="Click to filter Uncertain permissions"
        >
          <div className="stat-card-header">
            <span className="stat-label">Uncertain</span>
            <span
              className="stat-indicator-dot"
              style={{ backgroundColor: CLASSIFICATION_META[CLASSIFICATION_TYPES.UNCERTAIN]?.color }}
            />
          </div>
          <div className="stat-numeric-row">
            <span
              className="stat-number"
              style={{ color: CLASSIFICATION_META[CLASSIFICATION_TYPES.UNCERTAIN]?.color }}
            >
              {counts[CLASSIFICATION_TYPES.UNCERTAIN] || 0}
            </span>
            <span className="stat-pct">
              ({totalCount > 0 ? Math.round(((counts[CLASSIFICATION_TYPES.UNCERTAIN] || 0) / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="stat-footer-text">Ambiguous / experimental code</div>
        </button>

        {/* Conflicting Card */}
        <button
          type="button"
          className={`stat-card stat-conflicting ${
            activeClassification === CLASSIFICATION_TYPES.CONFLICTING ? 'active' : ''
          }`}
          onClick={() =>
            onSelectClassification(
              activeClassification === CLASSIFICATION_TYPES.CONFLICTING
                ? 'ALL'
                : CLASSIFICATION_TYPES.CONFLICTING
            )
          }
          aria-pressed={activeClassification === CLASSIFICATION_TYPES.CONFLICTING}
          title="Click to filter Conflicting permissions"
        >
          <div className="stat-card-header">
            <span className="stat-label">Conflicting</span>
            <span
              className="stat-indicator-dot"
              style={{ backgroundColor: CLASSIFICATION_META[CLASSIFICATION_TYPES.CONFLICTING]?.color }}
            />
          </div>
          <div className="stat-numeric-row">
            <span
              className="stat-number"
              style={{ color: CLASSIFICATION_META[CLASSIFICATION_TYPES.CONFLICTING]?.color }}
            >
              {counts[CLASSIFICATION_TYPES.CONFLICTING] || 0}
            </span>
            <span className="stat-pct">
              ({totalCount > 0 ? Math.round(((counts[CLASSIFICATION_TYPES.CONFLICTING] || 0) / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="stat-footer-text">Contradicts privacy claims</div>
        </button>
      </div>
    </section>
  );
}
