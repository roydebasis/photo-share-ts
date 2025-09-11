import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { APPLICATON_MESSAGES } from "../config/constants";
import { PaginationResult } from "../interfaces/DBQueryInterface";
import { Post } from "../interfaces/PostInterface";
import { FileUploadRequest } from "../interfaces/UploadInterface";
import { CommentService } from "../services/CommentService";
import { PostService } from "../services/PostService";
import { AppError } from "../utilities/AppError";
import { deleteFile, prepareRouteParams } from "../utilities/general";
import { sendError, sendSuccess } from "../utilities/responseHelpers";

export class PostController {
  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const creators = req.loggedInUser?.id ? [req.loggedInUser.id] : [];
      const users = await PostService.getAllPosts(
        prepareRouteParams(req.query),
        creators
      );
      sendSuccess<PaginationResult<Post>>(res, users);
    } catch (err: any) {
      next(err);
    }
  }

  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const post = await PostService.getPostById(id);
      sendSuccess<Post>(res, post);
    } catch (err: any) {
      next(err);
    }
  }

  static async create(
    req: Request & FileUploadRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validatedData = matchedData(req);
      // Get file information from upload middleware
      const fileInfo = req.fileInfo?.[0]; // Get first uploaded file
      if (!fileInfo) {
        return sendError(res, new AppError("No file uploaded", 400));
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
      sendSuccess<{ id: number }>(res, { id });
    } catch (err: any) {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const { filename } = req.files[0];
        deleteFile(filename, "posts");
      }
      next(err);
    }
  }

  static async update(
    req: Request & FileUploadRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      const find = await PostService.getPostById(id);
      if (find.user_id !== req.loggedInUser?.id) {
        throw new AppError(APPLICATON_MESSAGES.FORBIDDEN, 403);
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
      sendSuccess<null>(res, null);
    } catch (err: any) {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const { filename } = req.files[0];
        deleteFile(filename, "posts");
      }
      next(err);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const find = await PostService.getPostById(id);
      if (find.user_id !== req.loggedInUser?.id) {
        throw new AppError(APPLICATON_MESSAGES.UNAUTHORIZED, 403);
      }
      deleteFile(find.filename, "posts");
      const deleted = await PostService.destory(id);
      sendSuccess(res, { affected_rows: deleted });
    } catch (err: any) {
      next(err);
    }
  }

  static async like(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pid = Number(req.params.id);
      const user_id = req.loggedInUser?.id ? Number(req.loggedInUser.id) : 0;
      await PostService.getPostById(pid); // check if exists
      if (await PostService.isPostLiked(user_id, pid)) {
        return sendError(res, new AppError("Already liked.", 403));
      }
      const likeId = await PostService.likePost({
        user_id: user_id,
        post_id: pid,
      });

      //increment like count
      await PostService.increaseLikeCount(pid);
      sendSuccess<{ id: number }>(res, { id: likeId });
    } catch (err: any) {
      next(err);
    }
  }

  static async unlike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      await PostService.getPostById(id); // check if exists
      const deleted = await PostService.unlikePost({
        user_id: req.loggedInUser?.id,
        post_id: id,
      });
      await PostService.decreaseLikeCount(id);
      sendSuccess(res, { affected_rows: deleted });
    } catch (err: any) {
      next(err);
    }
  }

  static async getLikes(req: Request, res: Response): Promise<void> {}

  static async comments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const comments = await CommentService.getComments(
        id,
        prepareRouteParams(req.query)
      );
      sendSuccess(res, comments);
    } catch (err: any) {
      next(err);
    }
  }
}
