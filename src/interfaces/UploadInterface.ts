import { Request } from "express";

// Define the correct file type for multerer
export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
}

// Extended Request interface for file uploads
export interface FileUploadRequest extends Request {
    fileInfo?: Array<{
        mimeType: string;
        extension: string;
        mediaType: 'image' | 'video' | 'gif' | 'unknown';
        originalName: string;
        size: number;
    }>;
}