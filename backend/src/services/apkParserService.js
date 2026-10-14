import fs from 'node:fs';
import crypto from 'node:crypto';
import ApkReader from '@devicefarmer/adbkit-apkreader';
import { enrichPermission, RISK_LEVELS } from '../utils/permissionDictionary.js';

/**
 * Validates whether a file begins with standard ZIP archive magic bytes (PK\x03\x04 or PK\x05\x06).
 * Since APKs are zip archives, this prevents processing malformed or disguised files.
 */
export async function validateZipHeader(filePath) {
  return new Promise((resolve) => {
    const stream = fs.createReadStream(filePath, { start: 0, end: 3 });
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (buffer.length < 4) {
        return resolve(false);
      }
      // Standard ZIP header: 0x50 0x4B 0x03 0x04 (PK\x03\x04)
      // Empty ZIP header:    0x50 0x4B 0x05 0x06 (PK\x05\x06)
      // Spanned ZIP header:  0x50 0x4B 0x07 0x08 (PK\x07\x08)
      const isZip =
        buffer[0] === 0x50 &&
        buffer[1] === 0x4B &&
        (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07);

      resolve(isZip);
    });

    stream.on('error', () => resolve(false));
  });
}

/**
 * Calculates SHA-256 digest of a local file
 */
export async function calculateSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

/**
 * Safely removes a file from the disk, suppressing missing file errors
 */
export async function safeDeleteFile(filePath) {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.warn(`[Cleanup Warning] Could not remove temporary file ${filePath}:`, err.message);
  }
}

/**
 * Format bytes to readable size string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Core service to parse Android APK and extract permissions & metadata from AndroidManifest.xml
 */
export async function parseApkFile(filePath, originalFilename = 'uploaded.apk', fileSize = 0) {
  // 1. Validate file existence
  if (!fs.existsSync(filePath)) {
    throw new Error('APK file not found on server.');
  }

  // 2. Validate ZIP header structure
  const isValidZip = await validateZipHeader(filePath);
  if (!isValidZip) {
    throw new Error('Invalid APK file: File header does not match standard ZIP/APK signature.');
  }

  // 3. Compute SHA-256 for integrity & audit traceability
  const sha256 = await calculateSha256(filePath);

  // 4. Open and read manifest using adbkit-apkreader
  let reader;
  let manifest;
  try {
    reader = await ApkReader.open(filePath);
    manifest = await reader.readManifest();
  } catch (parseErr) {
    throw new Error(
      `Failed to parse AndroidManifest.xml: ${parseErr.message || 'Corrupted or encrypted manifest.'}`
    );
  }

  if (!manifest) {
    throw new Error('APK manifest could not be read or is empty.');
  }

  // 5. Extract application metadata
  const packageName = manifest.package || 'Unknown Package';
  const versionCode = manifest.versionCode !== undefined ? manifest.versionCode : null;
  const versionName = manifest.versionName || (versionCode ? `Build ${versionCode}` : 'Unknown Version');

  const usesSdk = manifest.usesSdk || {};
  const targetSdk = usesSdk.targetSdkVersion ? `Android API ${usesSdk.targetSdkVersion}` : 'Unspecified';
  const minSdk = usesSdk.minSdkVersion ? `Android API ${usesSdk.minSdkVersion}` : 'Unspecified';

  const appElement = manifest.application || {};
  let appName = packageName;
  if (typeof appElement.label === 'string' && appElement.label.trim() !== '') {
    appName = appElement.label;
  }

  const activities = Array.isArray(appElement.activities) ? appElement.activities : [];
  const services = Array.isArray(appElement.services) ? appElement.services : [];
  const receivers = Array.isArray(appElement.receivers) ? appElement.receivers : [];
  const providers = Array.isArray(appElement.providers) ? appElement.providers : [];

  // 6. Extract permissions from manifest.usesPermissions
  const rawUsesPermissions = manifest.usesPermissions || [];
  const permissionSet = new Set();

  for (const item of rawUsesPermissions) {
    if (typeof item === 'string') {
      permissionSet.add(item.trim());
    } else if (item && typeof item === 'object' && item.name) {
      permissionSet.add(item.name.trim());
    }
  }

  const extractedList = Array.from(permissionSet);

  // 7. Enrich each permission with human-friendly descriptions, groups, and audit checks
  const enrichedPermissions = extractedList.map((permKey, idx) => {
    const enriched = enrichPermission(permKey);
    return {
      id: `perm-${idx + 1}`,
      ...enriched,
    };
  });

  // Calculate statistics
  const dangerousCount = enrichedPermissions.filter(
    (p) => p.riskLevel === RISK_LEVELS.DANGEROUS
  ).length;
  const normalCount = enrichedPermissions.filter(
    (p) => p.riskLevel === RISK_LEVELS.NORMAL
  ).length;
  const specialCount = enrichedPermissions.filter(
    (p) => p.riskLevel === RISK_LEVELS.SPECIAL || p.riskLevel === RISK_LEVELS.SIGNATURE
  ).length;
  const customCount = enrichedPermissions.filter((p) => p.isCustom).length;

  return {
    success: true,
    specimenType: 'Real APK Manifest Extraction',
    file: {
      originalName: originalFilename,
      sizeBytes: fileSize,
      sizeFormatted: formatBytes(fileSize),
      sha256,
    },
    app: {
      name: appName,
      packageName,
      versionName,
      versionCode,
      targetSdk,
      minSdk,
      componentCounts: {
        activities: activities.length,
        services: services.length,
        receivers: receivers.length,
        providers: providers.length,
      },
    },
    stats: {
      totalPermissions: enrichedPermissions.length,
      dangerousCount,
      normalCount,
      specialCount,
      customCount,
    },
    permissions: enrichedPermissions,
    notice:
      'Important: APK permissions alone cannot establish whether an app is malicious. Reported permissions represent static capabilities declared in AndroidManifest.xml, not proof of runtime behavior, active tracking, or wrongdoing.',
    extractedAt: new Date().toISOString(),
  };
}
