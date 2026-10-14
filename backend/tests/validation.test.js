import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  validateZipHeader,
  formatBytes,
  safeDeleteFile,
  calculateSha256,
} from '../src/services/apkParserService.js';

test('Validation: formatBytes formats various sizes correctly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024 * 5), '5 MB');
  assert.equal(formatBytes(100 * 1024 * 1024), '100 MB');
});

test('Validation: validateZipHeader identifies invalid files', async () => {
  const tmpFile = path.join(os.tmpdir(), `test_invalid_${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, 'This is just plain text, not a zip or apk archive.');

  try {
    const isZip = await validateZipHeader(tmpFile);
    assert.equal(isZip, false, 'Plain text file should not pass zip header validation');
  } finally {
    await safeDeleteFile(tmpFile);
  }
});

test('Validation: validateZipHeader recognizes valid zip magic bytes', async () => {
  const tmpFile = path.join(os.tmpdir(), `test_valid_header_${Date.now()}.apk`);
  // Standard zip signature: 0x50 0x4b 0x03 0x04
  const zipHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]);
  fs.writeFileSync(tmpFile, zipHeader);

  try {
    const isZip = await validateZipHeader(tmpFile);
    assert.equal(isZip, true, 'File with standard PK signature should pass header check');
  } finally {
    await safeDeleteFile(tmpFile);
  }
});

test('Validation: safeDeleteFile safely unlinks existing files and does not throw on missing files', async () => {
  const tmpFile = path.join(os.tmpdir(), `test_delete_${Date.now()}.tmp`);
  fs.writeFileSync(tmpFile, 'Temporary content');

  assert.equal(fs.existsSync(tmpFile), true);
  await safeDeleteFile(tmpFile);
  assert.equal(fs.existsSync(tmpFile), false);

  // Calling on non-existent file should not throw
  await assert.doesNotReject(async () => {
    await safeDeleteFile(tmpFile);
  });
});

test('Validation: calculateSha256 produces valid hex digest', async () => {
  const tmpFile = path.join(os.tmpdir(), `test_hash_${Date.now()}.tmp`);
  fs.writeFileSync(tmpFile, 'Known content for sha256 test');

  try {
    const digest = await calculateSha256(tmpFile);
    assert.equal(typeof digest, 'string');
    assert.equal(digest.length, 64, 'SHA-256 string must be 64 hexadecimal characters');
  } finally {
    await safeDeleteFile(tmpFile);
  }
});
