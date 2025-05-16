const multer = require('multer');
const path = require('path');

// Configure storage 
// upload file in diskstorage
const storage = multer.diskStorage({
    //  destination of the file
  destination: (req, file, cb) => {
    cb(null , path.join(__dirname, '../../public/tmp')); // Use relative path
  },
//    name of the file 
  filename: (req, file, cb) => {
    //  give a unique name to file 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // extension of file
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Include file extension
  }
});

// File filter (Optional security)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images/videos are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;