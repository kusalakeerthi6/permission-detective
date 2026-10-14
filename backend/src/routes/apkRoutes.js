import express from 'express';
import multer from 'multer';
import { uploadSingleApk, MAX_FILE_SIZE_BYTES } from '../middleware/uploadMiddleware.js';
import { parseApkFile, safeDeleteFile, formatBytes } from '../services/apkParserService.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Permission Detective Backend',
    version: '1.0.0',
    maxUploadSize: formatBytes(MAX_FILE_SIZE_BYTES),
    timestamp: new Date().toISOString(),
  });
});

/**
 * APK Analysis endpoint
 * POST /api/analyze-apk
 * Accepts a multipart/form-data upload with field name 'apk'
 */
router.post('/analyze-apk', (req, res) => {
  uploadSingleApk(req, res, async (err) => {
    // Handle Multer upload errors
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: `File is too large. Maximum supported APK size is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
            code: 'FILE_TOO_LARGE',
          });
        }
        return res.status(400).json({
          success: false,
          error: `Upload error: ${err.message}`,
          code: err.code,
        });
      }

      return res.status(400).json({
        success: false,
        error: err.message || 'An error occurred during file upload.',
        code: err.code || 'UPLOAD_FAILED',
      });
    }

    // Verify file presence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No APK file uploaded. Please attach an APK file under the "apk" form field.',
        code: 'NO_FILE_PROVIDED',
      });
    }

    const uploadedFilePath = req.file.path;

    try {
      // Parse the APK and extract manifest data
      const analysisResult = await parseApkFile(
        uploadedFilePath,
        req.file.originalname,
        req.file.size
      );

      return res.status(200).json(analysisResult);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        error: parseError.message || 'Failed to analyze APK manifest.',
        code: 'PARSE_FAILED',
      });
    } finally {
      // Ensure the temporary uploaded file is deleted regardless of outcome
      await safeDeleteFile(uploadedFilePath);
    }
  });
});

export default router;
