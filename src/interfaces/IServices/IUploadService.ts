export interface UploadResponse {
    url: string;
    public_id: string;
}

export interface IUploadService {
    uploadImage(file: Express.Multer.File): Promise<UploadResponse>;
}
