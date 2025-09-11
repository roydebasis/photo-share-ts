// external imports
import createError from "http-errors";
import multer from "multer";
import path from "path";
import { MulterFile } from "../interfaces/UploadInterface";
import { createDirectory } from "../utilities/general";

// Enhanced file type detection
function detectFileType(file: MulterFile): {
  mimeType: string;
  extension: string;
  mediaType: "image" | "video" | "gif" | "unknown";
} {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  // Enhanced MIME type mapping
  const mimeTypeMap: Record<
    string,
    { extension: string; mediaType: "image" | "video" | "gif" }
  > = {
    "image/jpeg": { extension: ".jpg", mediaType: "image" },
    "image/jpg": { extension: ".jpg", mediaType: "image" },
    "image/png": { extension: ".png", mediaType: "image" },
    "image/gif": { extension: ".gif", mediaType: "gif" },
    "image/webp": { extension: ".webp", mediaType: "image" },
    "video/mp4": { extension: ".mp4", mediaType: "video" },
    "video/avi": { extension: ".avi", mediaType: "video" },
    "video/mov": { extension: ".mov", mediaType: "video" },
    "video/wmv": { extension: ".wmv", mediaType: "video" },
  };

  const detected = mimeTypeMap[mimeType];

  if (detected && detected.extension === extension) {
    return {
      mimeType,
      extension,
      mediaType: detected.mediaType,
    };
  }

  // Fallback: check extension only
  const extensionMap: Record<string, "image" | "video" | "gif"> = {
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "gif",
    ".webp": "image",
    ".mp4": "video",
    ".avi": "video",
    ".mov": "video",
    ".wmv": "video",
  };

  return {
    mimeType,
    extension,
    mediaType: extensionMap[extension] || "unknown",
  };
}

export default function uploader(
  subfolder_path: string,
  allowed_file_types: string[],
  max_file_size: number,
  error_msg: string
) {
  // File upload folder
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}/`;
  createDirectory(UPLOADS_FOLDER);
  // define the storage
  const storage = multer.diskStorage({
    destination: (req: any, file: MulterFile, cb: any) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req: any, file: MulterFile, cb: any) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // preapre the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req: any, file: MulterFile, cb: any) => {
      // Enhanced file type detection
      const fileInfo = detectFileType(file);

      // console.log(`File upload detected:`, {
      //   originalName: file.originalname,
      //   mimeType: fileInfo.mimeType,
      //   extension: fileInfo.extension,
      //   mediaType: fileInfo.mediaType,
      //   size: file.size,
      // });

      if (allowed_file_types.includes(file.mimetype)) {
        // Add file info to request for use in controller
        if (!req.fileInfo) {
          req.fileInfo = [];
        }
        req.fileInfo.push({
          ...fileInfo,
          originalName: file.originalname,
          size: file.size,
        });

        cb(null, true);
      } else {
        cb(
          createError(
            `${error_msg} Detected: ${fileInfo.mimeType} (${fileInfo.mediaType})`
          )
        );
      }
    },
  });

  return upload;
}
