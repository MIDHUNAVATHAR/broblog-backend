import cloudinary from '../config/cloudinary';
import { IUploadService, UploadResponse } from '../interfaces/IServices/IUploadService';

export class UploadService implements IUploadService {
  async uploadImage(file: Express.Multer.File): Promise<UploadResponse> {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    console.log("file,", file)
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'blog_images'
    });
    console.log("result", result)

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  }
} 
