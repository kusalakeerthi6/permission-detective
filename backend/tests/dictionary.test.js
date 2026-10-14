import test from 'node:test';
import assert from 'node:assert/strict';
import {
  enrichPermission,
  PERMISSION_GROUPS,
  RISK_LEVELS,
} from '../src/utils/permissionDictionary.js';

test('Dictionary: enriches dangerous permission READ_CONTACTS', () => {
  const perm = enrichPermission('android.permission.READ_CONTACTS');
  assert.equal(perm.name, 'READ_CONTACTS');
  assert.equal(perm.group, PERMISSION_GROUPS.CONTACTS);
  assert.equal(perm.riskLevel, RISK_LEVELS.DANGEROUS);
  assert.equal(perm.isCustom, false);
  assert.ok(perm.recommendedChecks.length > 0);
});

test('Dictionary: enriches dangerous permission ACCESS_FINE_LOCATION', () => {
  const perm = enrichPermission('android.permission.ACCESS_FINE_LOCATION');
  assert.equal(perm.name, 'ACCESS_FINE_LOCATION');
  assert.equal(perm.group, PERMISSION_GROUPS.LOCATION);
  assert.equal(perm.riskLevel, RISK_LEVELS.DANGEROUS);
});

test('Dictionary: enriches dangerous permission RECORD_AUDIO', () => {
  const perm = enrichPermission('android.permission.RECORD_AUDIO');
  assert.equal(perm.name, 'RECORD_AUDIO');
  assert.equal(perm.group, PERMISSION_GROUPS.MICROPHONE);
  assert.equal(perm.riskLevel, RISK_LEVELS.DANGEROUS);
});

test('Dictionary: enriches normal permission INTERNET', () => {
  const perm = enrichPermission('android.permission.INTERNET');
  assert.equal(perm.name, 'INTERNET');
  assert.equal(perm.group, PERMISSION_GROUPS.NETWORK);
  assert.equal(perm.riskLevel, RISK_LEVELS.NORMAL);
});

test('Dictionary: handles custom and third-party permissions gracefully', () => {
  const customPerm = enrichPermission('com.example.app.permission.CUSTOM_FEATURE');
  assert.equal(customPerm.name, 'CUSTOM_FEATURE');
  assert.equal(customPerm.isCustom, true);
  assert.equal(customPerm.group, PERMISSION_GROUPS.OTHER);
});

test('Dictionary: returns null for invalid or empty inputs', () => {
  assert.equal(enrichPermission(''), null);
  assert.equal(enrichPermission(null), null);
  assert.equal(enrichPermission(undefined), null);
});
