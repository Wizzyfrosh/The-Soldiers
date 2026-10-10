import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

export const uploadRouter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../public/uploads');

// Ensure upload directory exists safely (prevent crashing on read-only serverless file systems like Vercel)
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('⚠️ Unable to create local upload directory (read-only filesystem detected):', err);
}

// Check if Cloudinary credentials are provided in environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log('⚡ Cloudinary Media Storage active');
} else {
  console.log('ℹ️ Cloudinary credentials not detected. Uploads will use memory/local storage fallback');
}

// Use Multer Memory Storage to avoid writing to read-only disk on Vercel
const storage = multer.memoryStorage();

// File filter: accept images, video formats, and audio sermons
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mov', '.m4v', '.avi', '.mp3', '.m4a', '.wav'];
  const ext = path.extname(file.originalname).toLowerCase();

  const isMimeAllowed = 
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('audio/') ||
    file.mimetype === 'application/octet-stream';

  if (isMimeAllowed || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File format "${ext}" is not supported. Please upload an image (JPG, PNG, WEBP) or video/audio (MP4, WEBM, MOV, MP3).`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB max for video recordings
  }
});

// Middleware wrapper to catch Multer errors and return clean JSON
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err: any) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds maximum allowed limit (500 MB).' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    next();
  });
};

// POST /api/upload (Single file upload)
uploadRouter.post('/', handleUpload, async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was provided for upload.' });
    }

    // 1. Cloudinary upload if configured
    if (isCloudinaryConfigured) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: 'soldiers_church_uploads',
          resource_type: 'auto'
        });

        return res.status(201).json({
          message: 'File uploaded successfully to Cloudinary.',
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          provider: 'cloudinary'
        });
      } catch (cloudError: any) {
        console.error('Cloudinary upload error:', cloudError);
        return res.status(500).json({ error: `Cloudinary storage error: ${cloudError.message}` });
      }
    }

    // 2. Local disk storage (if local filesystem is writable)
    const ext = path.extname(req.file.originalname).toLowerCase();
    const sanitizedBase = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${sanitizedBase}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    try {
      if (fs.existsSync(uploadDir)) {
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        const fileUrl = `/uploads/${filename}`;

        return res.status(201).json({
          message: 'File uploaded successfully to local storage.',
          url: fileUrl,
          filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
          provider: 'local'
        });
      }
    } catch (fsErr) {
      console.warn('Local disk write failed (serverless environment detected), using Data URL fallback.');
    }

    // 3. Fallback to Data URL for read-only serverless environments (e.g. Vercel without Cloudinary credentials)
    const b64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${b64}`;

    return res.status(201).json({
      message: 'File uploaded successfully as Data URL.',
      url: dataUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      provider: 'base64'
    });
  } catch (error: any) {
    console.error('File upload controller error:', error);
    return res.status(500).json({ error: error.message || 'Server error during upload.' });
  }
});
