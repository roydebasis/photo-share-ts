import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { CommentPayload } from "../interfaces/CommentInterface";
import { FileUploadRequest } from "../interfaces/UploadInterface";
import { CommentService } from "../services/CommentService";
import { PostService } from "../services/PostService";
import { sendSuccess } from "../utilities/responseHelpers";

export class CommentController {
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await CommentService.getById(id);
      sendSuccess(res, user);
    } catch (err: any) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = matchedData(req);
      const data: CommentPayload = {
        user_id: req.loggedInUser!.id,
        post_id: validatedData.post_id,
        comment: validatedData.comment,
        parent_id: validatedData.parent_id,
      };
      const id = await CommentService.create(data);
      await PostService.increaseCommentCount(validatedData.post_id);
      sendSuccess<{ id: number }>(res, { id });
    } catch (err: any) {
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
      const find = await CommentService.getById(id);

      const validatedData = matchedData(req);
      const data: CommentPayload = {
        comment: validatedData.comment,
      };

      await CommentService.update(id, data);
      sendSuccess<null>(res, null);
    } catch (err: any) {
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
      const find = await CommentService.getById(id);
      const rowsAffected = await CommentService.destory(id);
      await PostService.decreaseCommentCount(find.post_id, rowsAffected);
      sendSuccess(res, { affected_rows: rowsAffected });
    } catch (err: any) {
      next(err);
    }
  }
}
