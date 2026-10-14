/**
 * Android Permission Dictionary & Risk Classification Reference
 * Maps standard Android permissions to system groups, protection tiers, descriptions,
 * and actionable privacy/security audit checks.
 */

export const PERMISSION_GROUPS = {
  LOCATION: 'Geographic Location (GPS / Network)',
  CONTACTS: 'Contacts & Address Book',
  MICROPHONE: 'Microphone & Audio Input',
  CAMERA: 'Camera & Visual Capture',
  STORAGE: 'Storage & Media Files',
  PHONE: 'Telephony & Call State',
  SMS: 'SMS & Messaging',
  CALENDAR: 'Calendar & Schedules',
  SENSORS: 'Sensors & Health Data',
  NEARBY: 'Nearby Devices & Bluetooth',
  NETWORK: 'Network & Connectivity',
  SYSTEM: 'System & Special Capabilities',
  OTHER: 'General Permissions',
};

export const RISK_LEVELS = {
  DANGEROUS: 'High Risk (Dangerous / Runtime)',
  NORMAL: 'Normal Risk (Install-time)',
  SIGNATURE: 'Signature / System Only',
  SPECIAL: 'Special App Access',
};

export const PERMISSION_DATABASE = {
  'android.permission.READ_CONTACTS': {
    name: 'READ_CONTACTS',
    group: PERMISSION_GROUPS.CONTACTS,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the application to read all contact details, names, phone numbers, and emails stored on the device.',
    recommendedChecks: [
      'Verify whether the app has user-facing social, sharing, or payee features requiring contacts.',
      'Inspect network traffic for exfiltration of contact lists or phone number hashes.',
      'Test if the contact picker (ACTION_PICK) can replace full read access.',
    ],
  },
  'android.permission.WRITE_CONTACTS': {
    name: 'WRITE_CONTACTS',
    group: PERMISSION_GROUPS.CONTACTS,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the application to modify or delete contact records in the user’s address book.',
    recommendedChecks: [
      'Confirm legitimate sync or contact editing features exist.',
      'Check for inadvertent contact modification or deletion logic.',
    ],
  },
  'android.permission.ACCESS_FINE_LOCATION': {
    name: 'ACCESS_FINE_LOCATION',
    group: PERMISSION_GROUPS.LOCATION,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Grants access to precise geographic coordinates via GPS, Wi-Fi, and cellular tower multilateration.',
    recommendedChecks: [
      'Audit store privacy policy to confirm location collection is disclosed.',
      'Verify if third-party ad or analytics SDKs trigger location requests.',
      'Evaluate whether coarse location (ACCESS_COARSE_LOCATION) or user-selected city suffices.',
    ],
  },
  'android.permission.ACCESS_COARSE_LOCATION': {
    name: 'ACCESS_COARSE_LOCATION',
    group: PERMISSION_GROUPS.LOCATION,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Grants access to approximate location (city-block level, usually within a few kilometers).',
    recommendedChecks: [
      'Verify whether approximate location is adequate for the declared features.',
      'Ensure background location updates are not silently registered.',
    ],
  },
  'android.permission.ACCESS_BACKGROUND_LOCATION': {
    name: 'ACCESS_BACKGROUND_LOCATION',
    group: PERMISSION_GROUPS.LOCATION,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to access device location even while running in the background or when the screen is off.',
    recommendedChecks: [
      'Check if the app offers continuous tracking (e.g. turn-by-turn navigation, geofencing).',
      'Verify compliance with Google Play background location policy and prominent disclosures.',
    ],
  },
  'android.permission.RECORD_AUDIO': {
    name: 'RECORD_AUDIO',
    group: PERMISSION_GROUPS.MICROPHONE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the application to access the microphone and record raw audio streams without additional user prompts.',
    recommendedChecks: [
      'Confirm whether voice recording or speech input is explicitly triggered by the user.',
      'Verify that audio buffers are processed on-device whenever possible rather than transmitted uncompressed.',
      'Inspect for background audio recording services or listeners.',
    ],
  },
  'android.permission.CAMERA': {
    name: 'CAMERA',
    group: PERMISSION_GROUPS.CAMERA,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Grants direct access to camera hardware to capture photos, record video, or scan barcodes.',
    recommendedChecks: [
      'Check whether the system camera intent (ACTION_IMAGE_CAPTURE) can replace direct camera hardware access.',
      'Verify camera previews only initialize when the camera screen is visibly active.',
    ],
  },
  'android.permission.READ_EXTERNAL_STORAGE': {
    name: 'READ_EXTERNAL_STORAGE',
    group: PERMISSION_GROUPS.STORAGE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to read files from shared device storage (photos, media, documents).',
    recommendedChecks: [
      'On Android 10+ (API 29+), verify migration to Scoped Storage.',
      'Check if Storage Access Framework (SAF) or Photo Picker can replace broad storage permissions.',
    ],
  },
  'android.permission.WRITE_EXTERNAL_STORAGE': {
    name: 'WRITE_EXTERNAL_STORAGE',
    group: PERMISSION_GROUPS.STORAGE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to write and modify files on external/shared storage.',
    recommendedChecks: [
      'Verify files are written to app-specific directories (getExternalFilesDir) where no permission is needed.',
      'Ensure sensitive user data is not saved in world-readable public storage locations.',
    ],
  },
  'android.permission.READ_MEDIA_IMAGES': {
    name: 'READ_MEDIA_IMAGES',
    group: PERMISSION_GROUPS.STORAGE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to read image files from shared storage on Android 13+ (API 33+).',
    recommendedChecks: [
      'Check if the Android Photo Picker can be used instead of granular media read access.',
    ],
  },
  'android.permission.READ_MEDIA_VIDEO': {
    name: 'READ_MEDIA_VIDEO',
    group: PERMISSION_GROUPS.STORAGE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to read video files from shared storage on Android 13+ (API 33+).',
    recommendedChecks: [
      'Verify whether user-selected video picker suffices instead of indexing all device videos.',
    ],
  },
  'android.permission.READ_MEDIA_AUDIO': {
    name: 'READ_MEDIA_AUDIO',
    group: PERMISSION_GROUPS.STORAGE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to read audio files from shared storage on Android 13+ (API 33+).',
    recommendedChecks: [
      'Confirm if media playback or audio editing is a core declared function of the app.',
    ],
  },
  'android.permission.READ_PHONE_STATE': {
    name: 'READ_PHONE_STATE',
    group: PERMISSION_GROUPS.PHONE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Grants read access to phone state, cellular network status, current call state, and device identifiers.',
    recommendedChecks: [
      'Ensure the app is not using this permission solely to read persistent hardware identifiers (IMEI / IMSI).',
      'Check if TelecomManager or AudioManager state changes can be handled without full phone state access.',
    ],
  },
  'android.permission.CALL_PHONE': {
    name: 'CALL_PHONE',
    group: PERMISSION_GROUPS.PHONE,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to initiate phone calls directly without routing through the default dialer UI.',
    recommendedChecks: [
      'Verify if ACTION_DIAL intent (which lets user confirm call in dialer) should be used instead.',
    ],
  },
  'android.permission.SEND_SMS': {
    name: 'SEND_SMS',
    group: PERMISSION_GROUPS.SMS,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to send SMS messages, which could result in carrier charges.',
    recommendedChecks: [
      'Inspect for automated premium SMS fraud or unauthorized background message dispatch.',
    ],
  },
  'android.permission.RECEIVE_SMS': {
    name: 'RECEIVE_SMS',
    group: PERMISSION_GROUPS.SMS,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the app to monitor, intercept, and process incoming SMS messages.',
    recommendedChecks: [
      'Verify if SMS Retriever API can be used for OTP verification without needing full SMS read permissions.',
    ],
  },
  'android.permission.POST_NOTIFICATIONS': {
    name: 'POST_NOTIFICATIONS',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.DANGEROUS,
    description: 'Allows the application to show notifications on Android 13+ (API 33+).',
    recommendedChecks: [
      'Verify notification channels are properly categorized so users can control alert frequency.',
    ],
  },
  'android.permission.INTERNET': {
    name: 'INTERNET',
    group: PERMISSION_GROUPS.NETWORK,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Allows the application to open network sockets and communicate over the internet.',
    recommendedChecks: [
      'Verify Network Security Config enforces TLS (cleartextTrafficPermitted="false").',
      'Audit outbound endpoints for telemetry and third-party advertising SDKs.',
    ],
  },
  'android.permission.ACCESS_NETWORK_STATE': {
    name: 'ACCESS_NETWORK_STATE',
    group: PERMISSION_GROUPS.NETWORK,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Allows the application to check current network connectivity (Wi-Fi, Cellular, Offline).',
    recommendedChecks: [
      'Standard permission for offline-aware apps to adapt network operations.',
    ],
  },
  'android.permission.ACCESS_WIFI_STATE': {
    name: 'ACCESS_WIFI_STATE',
    group: PERMISSION_GROUPS.NETWORK,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Allows the app to view information about Wi-Fi networking status.',
    recommendedChecks: [
      'Check if Wi-Fi SSID / BSSID scanning is used as a workaround for coarse location estimation.',
    ],
  },
  'android.permission.VIBRATE': {
    name: 'VIBRATE',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Allows access to the vibration motor for haptic feedback and alert notifications.',
    recommendedChecks: [
      'Standard utility permission for user feedback.',
    ],
  },
  'android.permission.WAKE_LOCK': {
    name: 'WAKE_LOCK',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Prevents the processor from sleeping or screen from dimming during long-running tasks.',
    recommendedChecks: [
      'Ensure wake locks are released promptly to prevent rapid device battery depletion.',
    ],
  },
  'android.permission.RECEIVE_BOOT_COMPLETED': {
    name: 'RECEIVE_BOOT_COMPLETED',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Allows the application to launch automatically once the device finishes booting.',
    recommendedChecks: [
      'Inspect if persistent background workers or sync jobs are necessary immediately upon device startup.',
    ],
  },
  'android.permission.FOREGROUND_SERVICE': {
    name: 'FOREGROUND_SERVICE',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.NORMAL,
    description: 'Allows the app to run foreground services accompanied by an ongoing notification.',
    recommendedChecks: [
      'On Android 14+ (API 34+), ensure specific foreground service types (dataSync, mediaPlayback, location) are declared.',
    ],
  },
  'android.permission.SYSTEM_ALERT_WINDOW': {
    name: 'SYSTEM_ALERT_WINDOW',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.SPECIAL,
    description: 'Allows the app to draw overlays over other applications (e.g. chat heads, floating widgets).',
    recommendedChecks: [
      'Scrutinize for overlay attacks, tapjacking vulnerabilities, or phishing screen spoofing.',
    ],
  },
  'android.permission.REQUEST_INSTALL_PACKAGES': {
    name: 'REQUEST_INSTALL_PACKAGES',
    group: PERMISSION_GROUPS.SYSTEM,
    riskLevel: RISK_LEVELS.SPECIAL,
    description: 'Allows the application to request installation of other APK packages.',
    recommendedChecks: [
      'High scrutiny: Sideloading capability should be limited strictly to app stores or MDM managers.',
    ],
  },
};

/**
 * Enriches a raw permission string extracted from AndroidManifest.xml
 * @param {string} rawPermission e.g. "android.permission.READ_CONTACTS"
 * @returns {object} Structured permission metadata object
 */
export function enrichPermission(rawPermission) {
  if (!rawPermission || typeof rawPermission !== 'string') {
    return null;
  }

  const cleanKey = rawPermission.trim();
  const known = PERMISSION_DATABASE[cleanKey];

  if (known) {
    return {
      permissionKey: cleanKey,
      name: known.name,
      group: known.group,
      riskLevel: known.riskLevel,
      description: known.description,
      recommendedChecks: known.recommendedChecks,
      isCustom: false,
    };
  }

  // Fallback for custom, OEM, or less common permissions
  const shortName = cleanKey.includes('.') ? cleanKey.split('.').pop() : cleanKey;
  const isDangerousHeuristic =
    cleanKey.includes('LOCATION') ||
    cleanKey.includes('CONTACTS') ||
    cleanKey.includes('RECORD_AUDIO') ||
    cleanKey.includes('CAMERA') ||
    cleanKey.includes('STORAGE') ||
    cleanKey.includes('SMS') ||
    cleanKey.includes('PHONE');

  return {
    permissionKey: cleanKey,
    name: shortName,
    group: cleanKey.startsWith('android.permission.')
      ? PERMISSION_GROUPS.SYSTEM
      : PERMISSION_GROUPS.OTHER,
    riskLevel: isDangerousHeuristic
      ? RISK_LEVELS.DANGEROUS
      : RISK_LEVELS.NORMAL,
    description: `Declared permission in manifest: ${cleanKey}. Refer to developer documentation for usage intent.`,
    recommendedChecks: [
      'Review manifest usage context and check if permission is requested dynamically at runtime.',
      'Inspect decompiled source code to identify classes or services invoking this capability.',
    ],
    isCustom: !cleanKey.startsWith('android.permission.'),
  };
}
