import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import createHttpError from 'http-errors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.join(__dirname, '../../tmp');

const storage = multer.diskStorage({
  destination: TMP_DIR,
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(createHttpError(400, 'Only image files are allowed.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('avatar');

// Multer kendi hatalarını (örn. LIMIT_FILE_SIZE) http-errors formatında üretmiyor,
// errorHandler bunları status'suz görüp 500 dönecekti — burada 400'e çeviriyoruz
export function uploadAvatar(req, res, next) {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(createHttpError(400, err.message));
    }
    if (err) return next(err);
    next();
  });
}
