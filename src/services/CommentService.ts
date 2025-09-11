import { APPLICATON_MESSAGES } from "../config/constants";
import { Comment, CommentPayload } from "../interfaces/CommentInterface";
import { PaginationResult, Params } from "../interfaces/DBQueryInterface";
import CommentModel from "../models/CommentModel";
import { AppError } from "../utilities/AppError";

export class CommentService {
  static async getById(id: number): Promise<Comment> {
    const post = await CommentModel.findById(id);
    if (!post) throw new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404);
    return post;
  }

  static async create(comment: CommentPayload): Promise<number> {
    return CommentModel.create(comment);
  }

  static async update(id: number, comment: CommentPayload): Promise<number> {
    const updated = await CommentModel.update(id, comment);
    if (updated === 0)
      throw new AppError(APPLICATON_MESSAGES.NOTHING_TO_UPDATE, 404);
    return updated;
  }

  static async destory(id: number): Promise<number> {
    const deleted = await CommentModel.delete(id);
    if (deleted === 0) throw new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404);
    return deleted;
  }

  static async getComments(
    post_id: number,
    params: Params
  ): Promise<PaginationResult<Comment>> {
    return await CommentModel.comments(post_id, params);
  }
}
