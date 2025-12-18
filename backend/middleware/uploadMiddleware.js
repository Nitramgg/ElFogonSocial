const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'el_fogon_posts', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'], // ¡Aceptamos videos también!
    resource_type: 'auto' // Detecta si es imagen o video automáticamente
  }
});

const upload = multer({ storage: storage });

module.exports = upload;