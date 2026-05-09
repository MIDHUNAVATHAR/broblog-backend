import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export class UploadController {
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      // Upload to Cloudinary from memory buffer
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        folder: 'blog_images'
      });

      res.status(200).json({
        url: result.secure_url,
        public_id: result.public_id
      });
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  }
}
