import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

(cloudinary.config as any)(process.env.CLOUDINARY_URL);

export default cloudinary;
