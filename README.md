# Permission Detective

Permission Detective is a web application that analyzes Android APK files and extracts their declared permissions from the Android manifest.

## Features

- Upload Android APK files for static analysis.
- Extract package name, version, SDK information, and application components.
- Display declared permissions with descriptions and protection categories.
- Calculate a SHA-256 fingerprint for the uploaded APK.
- Search and filter permissions.
- Includes a demo dashboard for exploring the interface.
- Validates uploaded files and handles errors.

## Technology Stack

- Frontend: React, Vite, JavaScript
- Backend: Node.js, Express
- APK parsing: @devicefarmer/adbkit-apkreader

## Run Locally

### Start the backend

Open a terminal and run:

```bash
cd backend
npm install
npm start
```

The backend runs on port 5000.

### Start the frontend

Open another terminal and run:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Run Backend Tests

```bash
cd backend
npm test
```

## Limitations

Permission Detective performs static APK manifest analysis. Declared permissions do not prove that an app uses those capabilities at runtime or misuses user data. It does not execute APK files.

## Security

Upload APK files only for analysis. The application does not need to install or execute them.