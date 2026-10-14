import React, { useState, useRef } from 'react';

export default function ApkUploadZone({
  onAnalysisSuccess,
  isAnalyzing,
  currentApkData,
  onResetToDemo,
  activeMode,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setUploadError(null);

    // Validate extension
    const fileName = file.name || '';
    if (!fileName.toLowerCase().endsWith('.apk')) {
      setUploadError('Invalid file type: Please upload an Android application package (.apk).');
      return;
    }

    // Validate size limit (100 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 100 MB.`);
      return;
    }

    uploadAndAnalyzeApk(file);
  };

  const uploadAndAnalyzeApk = (file) => {
    setIsUploading(true);
    setUploadProgress(15);
    setUploadError(null);

    const formData = new FormData();
    formData.append('apk', file);

    const xhr = new XMLHttpRequest();

    // Use relative path with fallback to backend port 5000 if proxy not reachable
    const uploadUrl = '/api/analyze-apk';

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 75); // up to 75% for upload, 25% for parsing
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(100);

      let response;
      try {
        response = JSON.parse(xhr.responseText);
      } catch (err) {
        response = { error: 'Invalid response from server.' };
      }

      if (xhr.status >= 200 && xhr.status < 300 && response.success) {
        onAnalysisSuccess(response);
      } else {
        const errorMsg =
          response.error ||
          (xhr.status === 0
            ? 'Cannot connect to backend server. Please verify backend is running on port 5000.'
            : `Analysis failed with HTTP ${xhr.status}.`);
        setUploadError(errorMsg);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(
        'Connection error: Failed to reach backend at http://localhost:5000. Ensure the Node.js server is started (`npm start` in backend).'
      );
    };

    xhr.open('POST', uploadUrl, true);
    xhr.send(formData);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <section className="apk-upload-section" aria-label="Android APK Upload Area">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".apk"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        aria-label="Upload Android APK file"
      />

      <div className="upload-container">
        {/* Upload Mode Status & Switcher Header */}
        <div className="upload-header-row">
          <div className="mode-indicator-group">
            <span className="mode-label">Specimen Source:</span>
            <div className="mode-toggle-group">
              <button
                type="button"
                className={`mode-toggle-btn ${activeMode === 'demo' ? 'active' : ''}`}
                onClick={onResetToDemo}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                </svg>
                QuickCalc Fictional Specimen
              </button>

              <button
                type="button"
                className={`mode-toggle-btn ${activeMode === 'real' ? 'active' : ''}`}
                onClick={triggerFileSelect}
                disabled={isUploading}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {currentApkData ? `Real APK: ${currentApkData.app.name}` : 'Upload Real APK'}
              </button>
            </div>
          </div>

          <div className="upload-limits-note">
            <span className="secure-badge">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Static Manifest Parse Only • Never Executed
            </span>
            <span className="limit-text">Max 100 MB</span>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          className={`dropzone-card ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!isUploading ? triggerFileSelect : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFileSelect();
            }
          }}
          aria-label="Drag and drop an Android APK file here or press Enter to browse"
        >
          {isUploading ? (
            <div className="uploading-state">
              <div className="upload-spinner" />
              <div className="upload-status-text">
                <h4>Analyzing Android APK Manifest...</h4>
                <p>Reading binary AndroidManifest.xml and extracting requested permissions</p>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-pct">{uploadProgress}%</span>
            </div>
          ) : currentApkData && activeMode === 'real' ? (
            <div className="uploaded-active-state">
              <div className="uploaded-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="uploaded-details">
                <div className="uploaded-title-row">
                  <span className="active-apk-tag">Active Real APK Specimen</span>
                  <span className="uploaded-filename">{currentApkData.file.originalName}</span>
                  <span className="uploaded-filesize">({currentApkData.file.sizeFormatted})</span>
                </div>
                <div className="uploaded-meta-row">
                  <span className="uploaded-sha">
                    SHA-256: <code>{currentApkData.file.sha256.substring(0, 16)}...</code>
                  </span>
                  <span className="dot-sep">•</span>
                  <span>Extracted {currentApkData.permissions.length} Manifest Permissions</span>
                </div>
              </div>
              <div className="uploaded-actions">
                <button
                  type="button"
                  className="reupload-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileSelect();
                  }}
                >
                  Upload Another APK
                </button>
              </div>
            </div>
          ) : (
            <div className="dropzone-idle-state">
              <div className="dropzone-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="34" height="34" stroke="currentColor" strokeWidth="1.75" fill="none">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
              </div>
              <div className="dropzone-text">
                <h3 className="dropzone-title">
                  Upload an Android APK to analyze declared permissions
                </h3>
                <p className="dropzone-desc">
                  Drag and drop your <code>.apk</code> file here, or{' '}
                  <span className="browse-link">browse files</span> from your computer
                </p>
              </div>
              <div className="dropzone-badge-row">
                <span className="badge-chip">AndroidManifest.xml Parser</span>
                <span className="badge-chip">Multer Safe Upload</span>
                <span className="badge-chip">Automatic Temp Cleanup</span>
              </div>
            </div>
          )}
        </div>

        {/* Error notification banner */}
        {uploadError && (
          <div className="upload-error-alert" role="alert">
            <div className="error-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="error-message">
              <strong>APK Analysis Failed:</strong> {uploadError}
            </div>
            <button
              type="button"
              className="dismiss-error-btn"
              onClick={() => setUploadError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
