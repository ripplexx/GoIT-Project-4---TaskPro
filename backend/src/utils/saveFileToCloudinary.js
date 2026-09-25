import fs from 'node:fs/promises';
import cloudinary from './cloudinary.js';

export async function saveFileToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'taskpro/avatars',
    });
    return result.secure_url;
  } finally {
    // Multer geçici dosyayı tmp/'a yazıyor, Cloudinary'ye yüklendikten sonra
    // diskte birikmesin diye sonucu ne olursa olsun siliyoruz
    await fs.unlink(filePath).catch(() => {});
  }
}
