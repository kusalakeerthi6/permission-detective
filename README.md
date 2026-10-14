# Permission Detective 🔍

Permission Detective is an automated mobile privacy analysis dashboard and Android APK permission extractor. It surfaces discrepancies between declared mobile application capabilities and operating system permissions, providing actionable triage checklists and risk insights for privacy auditors, security analysts, and developers.

---

## Architecture Overview

The project is structured into two main packages:

```
permission-detective/
├── backend/                  # Node.js + Express backend service
│   ├── src/
│   │   ├── app.js            # Express app configuration (CORS, routes, error handling)
│   │   ├── server.js         # HTTP server entrypoint (port 5000)
│   │   ├── routes/
│   │   │   └── apkRoutes.js  # POST /api/analyze-apk & GET /api/health
│   │   ├── middleware/
│   │   │   └── uploadMiddleware.js  # Multer configuration (100MB limit, .apk filter)
│   │   ├── services/
│   │   │   └── apkParserService.js  # adbkit-apkreader integration & temp cleanup
│   │   └── utils/
│   │       └── permissionDictionary.js # Android permission groups & risk levels
│   ├── tests/                # Automated tests (node:test)
│   │   ├── api.test.js
│   │   ├── dictionary.test.js
│   │   └── validation.test.js
│   └── package.json
│
├── client/                   # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApkUploadZone.jsx       # Drag & drop upload area with progress
│   │   │   ├── RealApkOverview.jsx     # Uploaded APK metadata & SHA-256 fingerprint
│   │   │   ├── AppOverview.jsx         # Fictional QuickCalc specimen profile
│   │   │   ├── DisclaimerBanner.jsx    # Privacy intelligence methodology disclaimer
│   │   │   ├── FilterControls.jsx      # Search & risk/classification filter controls
│   │   │   ├── Header.jsx              # Dashboard header with demo/real mode badge
│   │   │   ├── PermissionCard.jsx      # Permission cards with evidence & checks
│   │   │   ├── PermissionDetailModal.jsx # Forensic inspector & audit checklist
│   │   │   ├── StatsBar.jsx            # Summary statistics KPI cards
│   │   │   └── Footer.jsx              # Privacy engineering footer
│   │   ├── data/
│   │   │   └── mockAppData.js          # Baseline demo specimen data
│   │   ├── App.jsx                     # Core dashboard coordinator
│   │   └── index.css                   # Dark Navy theme design system
│   ├── vite.config.js                  # Proxy configuration to backend (port 5000)
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or newer (tested on Node.js v24.12.0)
- **npm**: v9.0.0 or newer

---

### 1. Backend Setup & Startup

Open a terminal in the project directory:

```bash
cd backend
npm install
npm start
```

For development mode with automatic restarts on code changes:
```bash
npm run dev
```

The backend server will run on:
- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`
- **Upload Endpoint**: `POST http://localhost:5000/api/analyze-apk`

---

### 2. Frontend Setup & Startup

Open a second terminal window:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:
- **Local Dashboard**: `http://localhost:5173`

---

## Testing with an APK

### Method A: Via the Web Dashboard (Recommended)
1. Ensure both the backend (`http://localhost:5000`) and client (`http://localhost:5173`) are running.
2. Open [http://localhost:5173](http://localhost:5173) in your browser.
3. Locate the **Specimen Source** banner at the top of the dashboard.
4. Drag and drop any `.apk` file (up to 100 MB) into the upload zone, or click **"browse files"** to select an APK from your computer.
5. The dashboard will show upload and parsing progress, extract the package metadata and declared permissions from `AndroidManifest.xml`, and display:
   - **App Metadata**: Package Name, Version Name/Code, Target SDK, Min SDK, and SHA-256 fingerprint.
   - **Declared Components**: Count of Activities, Services, Receivers, and Content Providers.
   - **Permissions Audit**: All requested permissions categorized by Risk Tier (Dangerous/Runtime, Normal/Install-time, Special App Access, Custom/OEM).
   - **Search & Filter**: Instant filtering by permission name, category, or risk tier.
   - **Deep Audit Modal**: Click **"Deep Audit"** on any card to view the manifest XML fragment and an interactive auditor verification checklist.
6. To return to the fictional baseline model at any time, click **"QuickCalc Fictional Specimen"** in the mode switcher.

### Method B: Via `curl` (API Direct)
You can test the backend directly using `curl`:

```bash
curl -X POST http://localhost:5000/api/analyze-apk \
  -F "apk=@/path/to/your/application.apk"
```

Sample JSON response:
```json
{
  "success": true,
  "specimenType": "Real APK Manifest Extraction",
  "file": {
    "originalName": "application.apk",
    "sizeBytes": 14205812,
    "sizeFormatted": "13.55 MB",
    "sha256": "3a7b...89c0"
  },
  "app": {
    "name": "Target App",
    "packageName": "com.example.app",
    "versionName": "1.0.0",
    "versionCode": 100,
    "targetSdk": "Android API 34",
    "minSdk": "Android API 26",
    "componentCounts": {
      "activities": 4,
      "services": 2,
      "receivers": 1,
      "providers": 0
    }
  },
  "stats": {
    "totalPermissions": 6,
    "dangerousCount": 2,
    "normalCount": 4,
    "specialCount": 0,
    "customCount": 0
  },
  "permissions": [
    {
      "id": "perm-1",
      "permissionKey": "android.permission.ACCESS_FINE_LOCATION",
      "name": "ACCESS_FINE_LOCATION",
      "group": "Geographic Location (GPS / Network)",
      "riskLevel": "High Risk (Dangerous / Runtime)",
      "description": "Grants access to precise geographic coordinates via GPS, Wi-Fi, and cellular tower multilateration.",
      "recommendedChecks": [
        "Audit store privacy policy to confirm location collection is disclosed.",
        "Verify if third-party ad or analytics SDKs trigger location requests."
      ]
    }
  ],
  "notice": "Important: APK permissions alone cannot establish whether an app is malicious. Reported permissions represent static capabilities declared in AndroidManifest.xml, not proof of runtime behavior, active tracking, or wrongdoing.",
  "extractedAt": "2026-10-14T12:00:00.000Z"
}
```

---

## Running Automated Tests

The backend includes a comprehensive suite of unit and integration tests using Node.js's built-in test runner (`node:test` and `node:assert`):

```bash
cd backend
npm test
```

### Tested Capabilities:
- **Zip Header Verification**: Validates standard `PK\x03\x04` signatures; rejects non-zip files disguised as APKs.
- **Resource Cleanup**: Verifies temporary files are unlinked after parsing and on error.
- **Integrity Digest**: Validates SHA-256 hash generation for APK files.
- **Dictionary & Heuristics**: Tests classification of dangerous, normal, and custom permissions.
- **API Error Handling**: Tests `GET /api/health`, missing file rejection (400), invalid file type (400), corrupted APK parsing (400), and 404 routes.

---

## Security & Privacy Principles

1. **Static Analysis Only**: Uploaded APK files are treated as read-only zip archives. Files are **never executed, installed, or emulated** on the host operating system.
2. **Automatic Cleanup**: Uploaded APK files are stored with random UUID filenames in a temporary directory and are deleted immediately in a `finally` block once manifest parsing concludes.
3. **Factual Reporting vs Malice Disclaimer**:
   > **Important Privacy Principle**: Declared permissions represent capabilities requested in `AndroidManifest.xml`. They are reported strictly as extracted facts, not as proof of runtime behavior, active surveillance, or malicious activity. An unexplained or dangerous permission may stem from third-party analytics SDKs, legacy code, or unreleased feature prototypes.
