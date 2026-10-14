import React, { useState, useMemo } from 'react';
import { QUICKCALC_APP_DATA, CLASSIFICATION_TYPES } from './data/mockAppData';
import Header from './components/Header';
import DisclaimerBanner from './components/DisclaimerBanner';
import AppOverview from './components/AppOverview';
import RealApkOverview from './components/RealApkOverview';
import ApkUploadZone from './components/ApkUploadZone';
import StatsBar from './components/StatsBar';
import FilterControls from './components/FilterControls';
import PermissionCard from './components/PermissionCard';
import PermissionDetailModal from './components/PermissionDetailModal';
import Footer from './components/Footer';

export default function App() {
  const [activeMode, setActiveMode] = useState('demo'); // 'demo' | 'real'
  const [realApkData, setRealApkData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClassification, setActiveClassification] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedPermission, setSelectedPermission] = useState(null);

  // Active permissions list depending on current mode
  const currentPermissions = useMemo(() => {
    if (activeMode === 'real' && realApkData) {
      return realApkData.permissions || [];
    }
    return QUICKCALC_APP_DATA.permissions;
  }, [activeMode, realApkData]);

  // Filter permissions based on search query, classification category, and risk tier
  const filteredPermissions = useMemo(() => {
    return currentPermissions.filter((perm) => {
      // 1. Classification filter (only active in demo mode)
      if (
        activeMode === 'demo' &&
        activeClassification !== 'ALL' &&
        perm.classification !== activeClassification
      ) {
        return false;
      }

      // 2. Risk filter
      const isHighRisk = perm.riskLevel && perm.riskLevel.toLowerCase().includes('high');
      const isNormalRisk = perm.riskLevel && perm.riskLevel.toLowerCase().includes('normal');
      const isSpecialRisk =
        perm.riskLevel &&
        (perm.riskLevel.toLowerCase().includes('special') ||
          perm.riskLevel.toLowerCase().includes('signature'));

      if (riskFilter === 'HIGH' && !isHighRisk) {
        return false;
      }
      if (riskFilter === 'NORMAL' && !isNormalRisk) {
        return false;
      }
      if (riskFilter === 'SPECIAL' && !isSpecialRisk) {
        return false;
      }
      if (riskFilter === 'CUSTOM' && !perm.isCustom) {
        return false;
      }

      // 3. Search term filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = perm.name && perm.name.toLowerCase().includes(query);
        const matchesKey = perm.permissionKey && perm.permissionKey.toLowerCase().includes(query);
        const matchesGroup =
          (perm.group && perm.group.toLowerCase().includes(query)) ||
          (perm.categoryGroup && perm.categoryGroup.toLowerCase().includes(query));
        const matchesSummary =
          (perm.summary && perm.summary.toLowerCase().includes(query)) ||
          (perm.description && perm.description.toLowerCase().includes(query));
        const matchesExplanation =
          perm.explanation && perm.explanation.toLowerCase().includes(query);
        const matchesTags =
          Array.isArray(perm.tags) &&
          perm.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesEvidence =
          Array.isArray(perm.evidence) &&
          perm.evidence.some((ev) => ev.toLowerCase().includes(query));
        const matchesChecks =
          Array.isArray(perm.recommendedChecks) &&
          perm.recommendedChecks.some((c) => c.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesKey &&
          !matchesGroup &&
          !matchesSummary &&
          !matchesExplanation &&
          !matchesTags &&
          !matchesEvidence &&
          !matchesChecks
        ) {
          return false;
        }
      }

      return true;
    });
  }, [currentPermissions, activeMode, activeClassification, riskFilter, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveClassification('ALL');
    setRiskFilter('ALL');
  };

  const handleAnalysisSuccess = (analysisResult) => {
    setRealApkData(analysisResult);
    setActiveMode('real');
    handleResetFilters();
  };

  const handleResetToDemo = () => {
    setActiveMode('demo');
    handleResetFilters();
  };

  const currentPackageName =
    activeMode === 'real' && realApkData
      ? realApkData.app.packageName
      : QUICKCALC_APP_DATA.packageName;

  return (
    <div className="app-shell">
      {/* Header with Title and Mode Indicator */}
      <Header
        onResetFilters={handleResetFilters}
        activeMode={activeMode}
        realAppName={realApkData?.app?.name}
      />

      {/* Main Content Dashboard */}
      <main className="main-content" role="main">
        {/* Real APK Upload Area */}
        <ApkUploadZone
          onAnalysisSuccess={handleAnalysisSuccess}
          currentApkData={realApkData}
          onResetToDemo={handleResetToDemo}
          activeMode={activeMode}
        />

        {/* Specimen Profile: Real APK or Fictional Demo */}
        {activeMode === 'real' && realApkData ? (
          <RealApkOverview apkData={realApkData} />
        ) : (
          <>
            {/* Core Privacy Intelligence & Non-Malicious Activity Disclaimer */}
            <DisclaimerBanner />
            {/* Fictional Specimen App Overview: QuickCalc */}
            <AppOverview />
          </>
        )}

        {/* Summary Statistics KPIs */}
        <StatsBar
          permissions={currentPermissions}
          activeClassification={activeClassification}
          onSelectClassification={setActiveClassification}
          mode={activeMode}
          riskFilter={riskFilter}
          onSelectRiskFilter={setRiskFilter}
        />

        {/* Permissions Analysis Section */}
        <section className="permissions-section" aria-label="Requested Permissions Analysis">
          {/* Search, Category and Risk Filters */}
          <FilterControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeClassification={activeClassification}
            setActiveClassification={setActiveClassification}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
            totalResults={filteredPermissions.length}
            totalPermissions={currentPermissions.length}
            onReset={handleResetFilters}
            mode={activeMode}
          />

          {/* Cards Grid */}
          <div className="permissions-grid">
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission) => (
                <PermissionCard
                  key={permission.id}
                  permission={permission}
                  onInspect={(perm) => setSelectedPermission(perm)}
                  mode={activeMode}
                />
              ))
            ) : (
              <div className="empty-state-card" role="status">
                <div className="empty-state-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="44"
                    height="44"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No matching permissions found</h3>
                <p className="empty-state-desc">
                  No permissions match your search or active filters.
                </p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={handleResetFilters}
                >
                  Clear all filters & search
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Detailed Forensic Inspector Modal */}
      {selectedPermission && (
        <PermissionDetailModal
          permission={selectedPermission}
          onClose={() => setSelectedPermission(null)}
          packageName={currentPackageName}
        />
      )}
    </div>
  );
}
