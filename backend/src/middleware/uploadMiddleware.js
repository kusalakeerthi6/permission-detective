import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the temporary uploads directory exists
export const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Maximum file size: 100 MB
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

// Configure disk storage with randomized filenames to prevent collisions & traversal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const randomHex = crypto.randomBytes(16).toString('hex');
    const safeName = `apk_${Date.now()}_${randomHex}.apk`;
    cb(null, safeName);
  },
});

// File filter: strict extension check for .apk
const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error('No file was provided in the upload request.'), false);
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.apk') {
    const error = new Error('Invalid file type: Only Android APK files (.apk) are accepted.');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }

  cb(null, true);
};

export const uploadSingleApk = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter,
}).single('apk');
