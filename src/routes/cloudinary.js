const express = require('express');
const crypto = require('crypto');
const { userAuth } = require('../middleware/auth');

/**
 * Cloudinary signed upload helper.
 *
 * Frontend calls:
 *   GET /api/cloudinary/signature?folder=ecommerce
 *
 * Response:
 *   { timestamp, folder, signature, apiKey, cloudName }
 *
 * Env required (Render / local):
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *   CLOUDINARY_CLOUD_NAME
 */
const cloudinaryRouter = express.Router();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const err = new Error(`Missing required env var: ${name}`);
    err.statusCode = 500;
    throw err;
  }
  return value;
}

function cloudinarySignature(paramsToSign, apiSecret) {
  // Per Cloudinary: signature = sha1("k1=v1&k2=v2..."+api_secret)
  const keys = Object.keys(paramsToSign).sort();
  const paramString = keys.map((k) => `${k}=${paramsToSign[k]}`).join('&');
  return crypto.createHash('sha1').update(paramString + apiSecret).digest('hex');
}

cloudinaryRouter.get('/signature', userAuth, (req, res) => {
  try {
    const apiKey = requireEnv('CLOUDINARY_API_KEY');
    const apiSecret = requireEnv('CLOUDINARY_API_SECRET');
    const cloudName = requireEnv('CLOUDINARY_CLOUD_NAME');

    const folder = (req.query.folder || 'ecommerce').toString();
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinarySignature({ folder, timestamp }, apiSecret);

    res.json({
      timestamp,
      folder,
      signature,
      apiKey,
      cloudName,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = { cloudinaryRouter };
