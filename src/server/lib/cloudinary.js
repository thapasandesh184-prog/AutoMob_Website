import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure env vars are loaded before config
dotenv.config();

function ensureConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[CLOUDINARY] Missing env vars:', {
      cloud_name: !!cloudName,
      api_key: !!apiKey,
      api_secret: !!apiSecret,
    });
    throw new Error('Cloudinary env vars missing');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function uploadToCloudinary(fileBuffer, options = {}) {
  ensureConfig();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'skay-auto-group',
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export { cloudinary };
