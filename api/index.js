import app from '../server/src/server.js';

export default async function handler(req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error('[Vercel Serverless Function Crash]:', err);
    return res.status(500).json({
      success: false,
      message: 'Serverless execution error: ' + (err.message || 'Unknown error'),
    });
  }
}
