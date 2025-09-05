import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { CustomAppRequest } from "../interfaces/Auth.Interface";
import { Post } from "../interfaces/Post.Interface";
import { FileUploadRequest } from "../interfaces/Upload.Interface";
import { PostService } from "../services/PostService";
import { deleteImage, prepareRouteParams } from "../utilities/general";
import {
  errorResponse,
  getErrorCode,
  successResponse,
} from "../utilities/responseHandlerHelper";

export class PostController {
  static async getAll(req: CustomAppRequest, res: Response): Promise<void> {
    try {
      const creators = req.loggedInUser?.id ? [req.loggedInUser.id] : [];
      const users = await PostService.getAllPosts(
        prepareRouteParams(req.query),
        creators
      );
      res.status(200).json(successResponse(users));
    } catch (err: any) {
      console.log(err);
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await PostService.getPostById(id);
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  static async create(
    req: CustomAppRequest & FileUploadRequest,
    res: Response
  ) {
    try {
      const validatedData = matchedData(req);
      // Get file information from upload middleware
      const fileInfo = req.fileInfo?.[0]; // Get first uploaded file

      if (!fileInfo) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const data: Omit<Post, "id"> = {
        caption: validatedData.caption,
        user_id: req.loggedInUser!.id,
        filename:
          req.files && Array.isArray(req.files) && req.files.length
            ? req.files[0].filename
            : "",
        original_filename: fileInfo.originalName,
        visibility: validatedData.visibility ?? "private",
        size:
          req.files && Array.isArray(req.files) && req.files.length
            ? req.files[0].size
            : 0,
        mime_type: fileInfo.mimeType,
        media_type:
          fileInfo.mediaType === "unknown" ? undefined : fileInfo.mediaType,
      };

      const id = await PostService.create(data);
      res.status(201).json(successResponse({ id: id }));
    } catch (err: any) {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const { filename } = req.files[0];
        deleteImage(filename, "posts");
      }
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async update(
    req: CustomAppRequest & FileUploadRequest,
    res: Response
  ) {
    try {
      const id = Number(req.params.id);
      const find = await PostService.getPostById(id);
      if (find.user_id !== req.loggedInUser?.id) {
        throw new Error("You are not authorized to update this post.");
      }
      const validatedData = matchedData(req);
      const data: Partial<Post> = {};
      if (validatedData.caption) {
        data.caption = validatedData.caption;
      }
      if (validatedData.visibility) {
        data.visibility = validatedData.visibility;
      }

      // Get file information from upload middleware
      const fileInfo = req.fileInfo?.[0]; // Get first uploaded file
      const file =
        req.files && Array.isArray(req.files) && req.files.length
          ? req.files[0]
          : null;
      if (fileInfo) {
        data.filename = file?.filename ?? "";
        data.original_filename = fileInfo.originalName;
        data.size = file?.size ?? 0;
        data.mime_type = fileInfo.mimeType;
        data.media_type =
          fileInfo.mediaType === "unknown" ? undefined : fileInfo.mediaType;
      }

      //Remove current image
      if (find.filename && file) {
        deleteImage(find.filename, "posts");
      }
      await PostService.update(id, data);
      res.status(200).json(successResponse(null, "Updated successfully."));
    } catch (err: any) {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const { filename } = req.files[0];
        deleteImage(filename, "posts");
      }
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async delete(req: CustomAppRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const find = await PostService.getPostById(id);
      if (find.user_id !== req.loggedInUser?.id) {
        throw new Error("You are not authorized to delete this post.");
      }
      deleteImage(find.filename, "posts");
      const deleted = await PostService.destory(id);
      res
        .status(200)
        .json(successResponse({ id: deleted }, "Deleted successfully."));
    } catch (err: any) {
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }
}
