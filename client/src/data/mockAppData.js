/**
 * Mock Data for Permission Detective Demo
 * Target Specimen: QuickCalc (Fictional Utility Application)
 */

export const CLASSIFICATION_TYPES = {
  EXPLAINED: 'Explained',
  UNEXPLAINED: 'Unexplained',
  UNCERTAIN: 'Uncertain',
  CONFLICTING: 'Conflicting',
};

export const CLASSIFICATION_META = {
  [CLASSIFICATION_TYPES.EXPLAINED]: {
    label: 'Explained',
    color: '#10b981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    description: 'Directly supported by documented app functionality and user-facing workflows.',
    icon: 'check-circle',
  },
  [CLASSIFICATION_TYPES.UNEXPLAINED]: {
    label: 'Unexplained',
    color: '#f43f5e', // Rose/Red
    bgColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    description: 'No apparent technical justification within declared calculator features. High scrutiny required.',
    icon: 'alert-triangle',
  },
  [CLASSIFICATION_TYPES.UNCERTAIN]: {
    label: 'Uncertain',
    color: '#f59e0b', // Amber
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    description: 'Plausible experimental feature or secondary capability, but lacks definitive user-facing documentation.',
    icon: 'help-circle',
  },
  [CLASSIFICATION_TYPES.CONFLICTING]: {
    label: 'Conflicting',
    color: '#a855f7', // Purple/Violet
    bgColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    description: 'Direct contradiction between store/privacy disclosures and actual technical manifest declarations.',
    icon: 'shield-alert',
  },
};

export const QUICKCALC_APP_DATA = {
  id: 'app-quickcalc-demo',
  name: 'QuickCalc',
  tagline: 'Precision Calculations & Rapid Bill Splitting',
  packageName: 'com.fictional.quickcalc',
  version: '2.4.1 (Build 240)',
  developer: 'Nova Utility Labs',
  category: 'Productivity & Utilities',
  targetSdk: 'Android 14 (API level 34)',
  minSdk: 'Android 8.0 (API level 26)',
  analysisDate: '2026-10-14 12:00:00 UTC',
  specimenType: 'APK Manifest Static & Behavioral Specimen',
  overallRiskLevel: 'High Review Priority',
  purpose:
    'QuickCalc is advertised as a lightweight, ad-free offline calculator for basic arithmetic, scientific calculation, offline unit conversions, and quick restaurant bill/expense splitting.',
  features: [
    {
      id: 'feat-1',
      title: 'Standard & Scientific Calculation',
      description: 'Arithmetic engine, trigonometry, log functions, and memory buffer operations stored locally.',
      badge: 'Core Feature',
    },
    {
      id: 'feat-2',
      title: 'Offline Unit & Currency Converter',
      description: 'Unit conversion matrices with cached foreign exchange rates for on-the-go travelers.',
      badge: 'Offline Utility',
    },
    {
      id: 'feat-3',
      title: 'Expense & Tip Splitter',
      description: 'Tabulates group meals and splits totals with customizable tip percentages on the device.',
      badge: 'Group Tool',
    },
    {
      id: 'feat-4',
      title: 'Local Calculation History',
      description: 'Stores recent calculations in an encrypted SQLite database on the client device.',
      badge: 'Device Storage',
    },
  ],
  permissions: [
    {
      id: 'perm-read-contacts',
      name: 'READ_CONTACTS',
      permissionKey: 'android.permission.READ_CONTACTS',
      protectionLevel: 'Dangerous (Runtime Permission)',
      riskLevel: 'High Risk',
      classification: CLASSIFICATION_TYPES.UNEXPLAINED,
      categoryGroup: 'Contacts & Personal Identity',
      summary: 'Grants raw read access to address book entries, phone numbers, and stored email addresses.',
      explanation:
        "QuickCalc requests read permissions to the user's entire address book and contact list. Stated core features—arithmetic, unit conversions, and local expense calculations—have no demonstrable technical dependency on contact data. The app does not advertise SMS invitations, cloud contacts syncing, or automated payee selection.",
      evidence: [
        'Manifest Declaration: <uses-permission android:name="android.permission.READ_CONTACTS" />',
        'Store Listing Audit: No mention of contact integration, social sharing, or friend address lookup.',
        'Bytecode Static Trace: ContentResolver query invoked against ContactsContract.CommonDataKinds.Phone in background service (com.fictional.quickcalc.sync.TelemetryWorker).',
        'UI Flow Audit: No user-facing UI screens or buttons ever prompt to select or display contacts.',
      ],
      recommendedChecks: [
        'Perform bytecode decompilation using jadx to inspect TelemetryWorker.class and locate the contact query URI.',
        'Set up a network proxy (Mitmproxy / Burp Suite) to inspect if serialized contact vCards or phone hashes are transmitted in outbound HTTP payloads.',
        'Remove the permission declaration from AndroidManifest.xml and verify if calculator or bill-split functions operate without exceptions.',
        'Check third-party analytics libraries bundled in the APK (e.g. legacy ad SDKs or tracking jars).',
      ],
      tags: ['Privacy Disparity', 'Data Exfiltration Risk', 'Zero Justification', 'Dangerous API'],
    },
    {
      id: 'perm-fine-location',
      name: 'ACCESS_FINE_LOCATION',
      permissionKey: 'android.permission.ACCESS_FINE_LOCATION',
      protectionLevel: 'Dangerous (Runtime Permission)',
      riskLevel: 'High Risk',
      classification: CLASSIFICATION_TYPES.CONFLICTING,
      categoryGroup: 'Precise Geographic Location (GPS)',
      summary: 'Grants access to precise GPS coordinates and network location providers.',
      explanation:
        "A severe contradiction exists between QuickCalc's public privacy claims and technical implementation. The Google Play store description highlights: '100% Offline & Private: We NEVER track your physical location or share user data.' Yet, the manifest requests precise GPS hardware coordinates. While bill-splitting tools occasionally claim location is used for automatic local tax calculation, QuickCalc embeds hardcoded tax presets, directly contradicting the need for live GPS polling.",
      evidence: [
        'Manifest Declaration: <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
        'Play Store Privacy Policy: Explicitly claims "No physical location data is collected, stored, or processed by QuickCalc".',
        'Codebase Call: FusedLocationProviderClient.requestLocationUpdates() registered in MainActivity lifecycle.',
        'Manifest metadata includes an embedded commercial geofencing/ad-broker telemetry tag.',
      ],
      recommendedChecks: [
        'Validate whether location calls originate from first-party app code or an obfuscated third-party SDK.',
        'Execute the application in an emulator with mock GPS coordinates to capture the exact trigger moment.',
        'Replace fine location access with manual locale selection or non-intrusive IP-level coarse geo-lookup if tax rates are truly needed.',
        'Flag for regulatory compliance review regarding GDPR/CCPA misrepresentation in privacy disclosures.',
      ],
      tags: ['Policy Contradiction', 'Store Claim Mismatch', 'GPS Tracking', 'Compliance Violation'],
    },
    {
      id: 'perm-record-audio',
      name: 'RECORD_AUDIO',
      permissionKey: 'android.permission.RECORD_AUDIO',
      protectionLevel: 'Dangerous (Runtime Permission)',
      riskLevel: 'High Risk',
      classification: CLASSIFICATION_TYPES.UNCERTAIN,
      categoryGroup: 'Microphone & Audio Input',
      summary: 'Allows the application to capture raw audio input from the device microphone at any time.',
      explanation:
        "The app requests full microphone access. Developer internal release notes vaguely reference an experimental 'Voice Dictation Math Input' ('Calculate 25 percent of 120'), but this feature is absent from the production settings and UI screens. It is uncertain whether this is an abandoned internal prototype, dead code left behind by developers, or unannounced background audio sensing.",
      evidence: [
        'Manifest Declaration: <uses-permission android:name="android.permission.RECORD_AUDIO" />',
        'APK Assets & Symbols: Contains native AudioRecord buffer allocation and 16kHz audio sampling constants.',
        'UI Interface: No microphone icon or voice input button is visible in the standard calculator keypad.',
        'Feature Flag: SharedPreferences config references "enable_voice_math_beta = false".',
      ],
      recommendedChecks: [
        'Deploy Frida script to hook android.media.AudioRecord.startRecording and confirm if audio streams ever trigger during normal app usage.',
        'Check whether audio processing uses Google On-Device SpeechRecognizer or streams raw uncompressed PCM buffers.',
        'Advise the development team to strip RECORD_AUDIO until the voice math feature is officially launched and user-consented.',
      ],
      tags: ['Experimental Flag', 'Dormant Code', 'Sensor Access', 'Requires Dynamic Hooking'],
    },
    {
      id: 'perm-internet',
      name: 'INTERNET',
      permissionKey: 'android.permission.INTERNET',
      protectionLevel: 'Normal Permission (Install-time)',
      riskLevel: 'Normal Risk',
      classification: CLASSIFICATION_TYPES.EXPLAINED,
      categoryGroup: 'Network Communication',
      summary: 'Allows the application to create network sockets and access internet services.',
      explanation:
        'QuickCalc requests standard internet socket communication. This is verified to support the currency exchange rate synchronization feature, where the app periodically polls exchange rate API endpoints (e.g., European Central Bank / public rate endpoints) and submits anonymous crash telemetry.',
      evidence: [
        'Manifest Declaration: <uses-permission android:name="android.permission.INTERNET" />',
        'Network Security Config: Configured with cleartextTrafficPermitted="false", enforcing strict TLS 1.3.',
        'HTTP Traffic Log: Verified periodic GET requests directed to currency API (api.frankfurter.app) with no user identifiers.',
        'Documentation Alignment: Stated in app settings under "Automatic Currency Update Frequency".',
      ],
      recommendedChecks: [
        'Verify SSL/TLS certificate pinning to prevent MitM interception of currency rate feeds.',
        'Verify that outgoing HTTP query parameters do not leak Android Advertising ID (AAID) or hardware serial numbers.',
        'Ensure graceful offline fallback when network is disconnected or in airplane mode.',
      ],
      tags: ['Documented Feature', 'Network Sync', 'TLS Enforced', 'Standard Capability'],
    },
  ],
};

export const METHODOLOGY_DISCLAIMER = {
  title: 'Privacy Intelligence & Methodology Note',
  summary:
    'An "Unexplained" or "Conflicting" permission classification highlights a discrepancy between declared functionality and OS capabilities. It does NOT prove malicious activity or unauthorized surveillance.',
  details:
    'Static manifest analysis identifies requested permissions compared against declared feature sets. Permissions may appear unexplained due to dormant prototype code, bundled analytics or ad SDKs, third-party libraries, legacy boilerplate, or unannounced roadmap features. Comprehensive security assessments require combined static analysis, dynamic behavioral sandbox traces, and decompiled code auditing before reaching definitive threat conclusions.',
};
