import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test('API: GET /api/health returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'Permission Detective Backend');
  assert.ok(data.maxUploadSize);
});

test('API: POST /api/analyze-apk with no file returns 400 NO_FILE_PROVIDED', async () => {
  const formData = new FormData();
  // No file appended

  const res = await fetch(`${baseUrl}/api/analyze-apk`, {
    method: 'POST',
    body: formData,
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'NO_FILE_PROVIDED');
});

test('API: POST /api/analyze-apk with non-apk file returns 400 INVALID_FILE_TYPE', async () => {
  const formData = new FormData();
  const fileBlob = new Blob(['Dummy file text content'], { type: 'text/plain' });
  formData.append('apk', fileBlob, 'sample_document.txt');

  const res = await fetch(`${baseUrl}/api/analyze-apk`, {
    method: 'POST',
    body: formData,
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'INVALID_FILE_TYPE');
});

test('API: POST /api/analyze-apk with corrupted/fake APK returns 400 PARSE_FAILED', async () => {
  const formData = new FormData();
  // Name ends in .apk, but content is arbitrary text without ZIP/APK headers
  const fileBlob = new Blob(['Fake APK binary payload that is actually text'], {
    type: 'application/vnd.android.package-archive',
  });
  formData.append('apk', fileBlob, 'corrupted_test.apk');

  const res = await fetch(`${baseUrl}/api/analyze-apk`, {
    method: 'POST',
    body: formData,
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'PARSE_FAILED');
  assert.ok(data.error.includes('header') || data.error.includes('signature') || data.error.includes('parse'));
});

test('API: Unknown route returns 404 NOT_FOUND', async () => {
  const res = await fetch(`${baseUrl}/api/non-existent-route`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.code, 'NOT_FOUND');
});
