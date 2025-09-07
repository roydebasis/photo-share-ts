import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { APPLICATON_MESSAGES } from "../config/constants";
import { CustomAppRequest } from "../interfaces/Auth.Interface";
import { CommentPayload } from "../interfaces/CommentInterface";
import { FileUploadRequest } from "../interfaces/Upload.Interface";
import { CommentService } from "../services/CommentService";
import {
  errorResponse,
  getErrorCode,
  successResponse,
} from "../utilities/responseHandlerHelper";

export class CommentController {
  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await CommentService.getById(id);
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  static async create(req: CustomAppRequest, res: Response) {
    try {
      const validatedData = matchedData(req);
      const data: CommentPayload = {
        user_id: req.loggedInUser!.id,
        post_id: validatedData.post_id,
        comment: validatedData.comment,
        parent_id: validatedData.parent_id,
      };
      const id = await CommentService.create(data);
      res
        .status(201)
        .json(successResponse({ id: id }, APPLICATON_MESSAGES.CREATED));
    } catch (err: any) {
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async update(
    req: CustomAppRequest & FileUploadRequest,
    res: Response
  ) {
    try {
      const id = Number(req.params.id);
      const find = await CommentService.getById(id);

      const validatedData = matchedData(req);
      const data: CommentPayload = {
        comment: validatedData.comment,
      };

      await CommentService.update(id, data);
      res.status(200).json(successResponse(null, APPLICATON_MESSAGES.UPDATED));
    } catch (err: any) {
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }

  static async delete(req: CustomAppRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const rows = await CommentService.destory(id);
      res
        .status(200)
        .json(
          successResponse({ item_deleted: rows }, APPLICATON_MESSAGES.DELETED)
        );
    } catch (err: any) {
      res.status(getErrorCode(err)).json(errorResponse(err));
    }
  }
}
