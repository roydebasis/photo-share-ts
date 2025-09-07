import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { APPLICATON_MESSAGES } from "../config/constants";
import { CustomAppRequest } from "../interfaces/Auth.Interface";
import { Post } from "../interfaces/Post.Interface";
import { FileUploadRequest } from "../interfaces/Upload.Interface";
import { CommentService } from "../services/CommentService";
import { PostService } from "../services/PostService";
import { deleteFile, prepareRouteParams } from "../utilities/general";
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
      res
        .status(201)
        .json(successResponse({ id: id }, APPLICATON_MESSAGES.CREATED));
    } catch (err: any) {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const { filename } = req.files[0];
        deleteFile(filename, "posts");
      }
      console.log(err);
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
        throw new Error(APPLICATON_MESSAGES.UNAUTHORIZED);
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
        deleteFile(find.filename, "posts");
      }
      await PostService.update(id, data);
      res.status(200).json(successResponse(null, APPLICATON_MESSAGES.UPDATED));
    } catch (err: any) {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const { filename } = req.files[0];
        deleteFile(filename, "posts");
      }
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async delete(req: CustomAppRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const find = await PostService.getPostById(id);
      if (find.user_id !== req.loggedInUser?.id) {
        throw new Error(APPLICATON_MESSAGES.UNAUTHORIZED);
      }
      deleteFile(find.filename, "posts");
      const deleted = await PostService.destory(id);
      res
        .status(200)
        .json(successResponse({ id: deleted }, APPLICATON_MESSAGES.DELETED));
    } catch (err: any) {
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async like(req: CustomAppRequest, res: Response): Promise<void> {
    try {
      const pid = Number(req.params.id);
      const user_id = req.loggedInUser?.id ? Number(req.loggedInUser.id) : 0;
      if (await PostService.isPostLiked(user_id, pid)) {
        throw new Error(APPLICATON_MESSAGES.ALREADY_LIKED);
      }
      const likeId = await PostService.likePost({
        user_id: user_id,
        post_id: pid,
      });
      res
        .status(200)
        .json(
          successResponse({ id: likeId }, APPLICATON_MESSAGES.LIKE_SUCCESS)
        );
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        res
          .status(400)
          .json(errorResponse(err, APPLICATON_MESSAGES.ALREADY_LIKED));
      }
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async unlike(req: CustomAppRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const find = await PostService.unlikePost({
        user_id: req.loggedInUser?.id,
        post_id: id,
      });
      res
        .status(200)
        .json(successResponse({ id: id }, APPLICATON_MESSAGES.UNLIKE_SUCCESS));
    } catch (err: any) {
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async getLikes(req: Request, res: Response): Promise<void> {}

  static async comments(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const comments = await CommentService.getComments(
        id,
        prepareRouteParams(req.query)
      );
      res.status(200).json(successResponse(comments));
    } catch (err: any) {
      console.log(err);
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }
}
