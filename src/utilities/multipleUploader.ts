// external imports
import multer from "multer";
import path from "path";
import createError from "http-errors";
import { Request } from "express";
import { MulterFile } from "../interfaces/Upload.Interface";

function uploader(
  subfolder_path: string,
  allowed_file_types: string[],
  max_file_size: number,
  max_number_of_files: number,
  error_msg: string
) { 
  // File upload folder
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}/`;

  // define the storage
  const storage = multer.diskStorage({
    destination: (req: Request, file: MulterFile, cb: any) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
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
    fileFilter: (req: Request, file: MulterFile, cb: any) => {
      if (req.files && Array.isArray(req.files) && req.files.length > max_number_of_files) {
        cb(
          createError(
            `Maximum ${max_number_of_files} files are allowed to upload!`
          )
        );
      } else {
        if (allowed_file_types.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(createError(error_msg));
        }
      }
    },
  });

  return upload;
}

export default uploader;
