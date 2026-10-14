import React from 'react';
import { CLASSIFICATION_TYPES, CLASSIFICATION_META } from '../data/mockAppData';

export default function FilterControls({
  searchTerm,
  setSearchTerm,
  activeClassification,
  setActiveClassification,
  riskFilter,
  setRiskFilter,
  totalResults,
  totalPermissions,
  onReset,
  mode = 'demo', // 'demo' | 'real'
}) {
  const isFiltered =
    searchTerm.trim() !== '' ||
    (mode === 'demo' && activeClassification !== 'ALL') ||
    riskFilter !== 'ALL';

  return (
    <div className="filter-controls-container" role="search" aria-label="Permission Filters">
      {/* Top Search Input Row */}
      <div className="search-row">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="permission-search-input"
            type="search"
            className="search-input"
            placeholder={
              mode === 'real'
                ? 'Search manifest permissions (e.g. CAMERA, LOCATION, STORAGE, INTERNET)...'
                : 'Search permissions by name, group, keyword, or evidence...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search permissions"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>

        {mode === 'demo' ? (
          <div className="risk-filter-select-wrapper">
            <label htmlFor="risk-select" className="filter-label">
              Risk Tier:
            </label>
            <select
              id="risk-select"
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk (Dangerous)</option>
              <option value="NORMAL">Normal Risk (Install-time)</option>
            </select>
          </div>
        ) : (
          <div className="risk-filter-select-wrapper">
            <label htmlFor="risk-select-real" className="filter-label">
              Risk Filter:
            </label>
            <select
              id="risk-select-real"
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">Dangerous / Runtime</option>
              <option value="NORMAL">Normal / Install-time</option>
              <option value="SPECIAL">Special App Access</option>
              <option value="CUSTOM">Custom / OEM</option>
            </select>
          </div>
        )}
      </div>

      {/* Filter Tabs Row */}
      <div className="filter-pills-row">
        {mode === 'demo' ? (
          <div className="pills-scroll-group" role="tablist" aria-label="Classification Filters">
            <button
              type="button"
              role="tab"
              aria-selected={activeClassification === 'ALL'}
              className={`filter-pill ${activeClassification === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveClassification('ALL')}
            >
              All Categories
            </button>

            {Object.values(CLASSIFICATION_TYPES).map((category) => {
              const meta = CLASSIFICATION_META[category] || {};
              const isActive = activeClassification === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                  style={{
                    '--pill-accent': meta.color,
                  }}
                  onClick={() => setActiveClassification(category)}
                >
                  <span
                    className="pill-dot"
                    style={{ backgroundColor: meta.color }}
                  />
                  {category}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pills-scroll-group" role="tablist" aria-label="Risk Tier Filters">
            <button
              type="button"
              role="tab"
              aria-selected={riskFilter === 'ALL'}
              className={`filter-pill ${riskFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setRiskFilter('ALL')}
            >
              All Extracted
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={riskFilter === 'HIGH'}
              className={`filter-pill ${riskFilter === 'HIGH' ? 'active' : ''}`}
              style={{ '--pill-accent': '#f43f5e' }}
              onClick={() => setRiskFilter('HIGH')}
            >
              <span className="pill-dot" style={{ backgroundColor: '#f43f5e' }} />
              Dangerous / Runtime
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={riskFilter === 'NORMAL'}
              className={`filter-pill ${riskFilter === 'NORMAL' ? 'active' : ''}`}
              style={{ '--pill-accent': '#10b981' }}
              onClick={() => setRiskFilter('NORMAL')}
            >
              <span className="pill-dot" style={{ backgroundColor: '#10b981' }} />
              Normal / Install
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={riskFilter === 'SPECIAL'}
              className={`filter-pill ${riskFilter === 'SPECIAL' ? 'active' : ''}`}
              style={{ '--pill-accent': '#a855f7' }}
              onClick={() => setRiskFilter('SPECIAL')}
            >
              <span className="pill-dot" style={{ backgroundColor: '#a855f7' }} />
              Special Access
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={riskFilter === 'CUSTOM'}
              className={`filter-pill ${riskFilter === 'CUSTOM' ? 'active' : ''}`}
              style={{ '--pill-accent': '#f59e0b' }}
              onClick={() => setRiskFilter('CUSTOM')}
            >
              <span className="pill-dot" style={{ backgroundColor: '#f59e0b' }} />
              Custom / OEM
            </button>
          </div>
        )}

        {/* Counter and Reset */}
        <div className="filter-results-status">
          <span className="results-counter">
            Showing <strong>{totalResults}</strong> of {totalPermissions} permissions
          </span>

          {isFiltered && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={onReset}
              title="Reset all search queries and filters"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
