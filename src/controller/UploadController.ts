import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../constants/statusCodes';
import { IUploadService } from '../interfaces/IServices/IUploadService';
import { CustomError } from '../middlewares/error.middleware';

export class UploadController {
  private _uploadService: IUploadService;

  constructor(uploadService: IUploadService) {
    this._uploadService = uploadService;
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        const error = new Error('No file uploaded') as CustomError;
        error.statusCode = StatusCode.BAD_REQUEST;
        next(error);
        return;
      }

      const result = await this._uploadService.uploadImage(req.file);

      res.status(StatusCode.OK).json({
        url: result.url,
        public_id: result.public_id
      });
    } catch (error) {
      next(error);
    }
  }
}
