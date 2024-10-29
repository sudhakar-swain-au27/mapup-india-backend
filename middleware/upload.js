import multer from 'multer';
import fs from 'fs';
import path from 'path';

/**
 * @constant storage - Configures multer storage for file uploads
 * @property {string} destination - Directory to save uploaded files
 * @property {Function} filename - Custom naming logic to prevent overwriting existing files
 */
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uploadPath = path.join('uploads', file.originalname);

    if (fs.existsSync(uploadPath)) {
      const uniqueSuffix = Date.now();
      const [name, extension] = file.originalname.split('.');
      cb(null, `${name}-${uniqueSuffix}.${extension}`);
    } else {
      cb(null, file.originalname);
    }
  },
});

/**
 * @constant upload - Multer middleware configured with disk storage for file uploads
 */
const upload = multer({ storage });

export default upload;
