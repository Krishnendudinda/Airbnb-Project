const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEYS,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",
        allowed_formats: ['jpeg', 'png', 'jpg', ,'webp', 'gif', 'svg', 'heic', 'heif','pdf'],
    }
});    

module.exports = {
    cloudinary,
    storage,
};