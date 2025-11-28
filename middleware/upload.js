import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "properties_images",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4"], 
  },
});

const upload = multer({ storage });

export default upload;
