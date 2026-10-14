import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Permission Detective Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Permission Detective Backend] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Permission Detective Backend] Ready to accept APK uploads at POST http://localhost:${PORT}/api/analyze-apk`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});
