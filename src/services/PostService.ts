import { resolveObjectURL } from "buffer";
import { APPLICATON_MESSAGES } from "../config/constants";
import { PaginationResult, Params } from "../interfaces/DBQueryInterface";
import { PostLikePayload } from "../interfaces/LikeInterface";
import { Post } from "../interfaces/PostInterface";
import PostModel from "../models/PostModel";
import { AppError } from "../utilities/AppError";
import { promises } from "dns";

export class PostService {
  static async getAllPosts(
    params: Params,
    includeCreators: number[] = [],
    excludeCreators: number[] = []
  ): Promise<PaginationResult<Post>> {
    return await PostModel.findAll(params, includeCreators, excludeCreators);
  }

  static async getPostById(id: number): Promise<Post> {
    const post = await PostModel.findById(id);
    if (!post) throw new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404);
    return post;
  }

  static async create(post: Omit<Post, "id">): Promise<number> {
    return PostModel.create(post);
  }

  static async update(id: number, post: Partial<Post>): Promise<number> {
    const updated = await PostModel.update(id, post);
    if (updated === 0)
      throw new AppError(APPLICATON_MESSAGES.NOTHING_TO_UPDATE, 400);
    return updated;
  }

  static async destory(id: number): Promise<number> {
    const deleted = await PostModel.delete(id);
    if (deleted === 0) throw new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404);
    return deleted;
  }

  static async likePost(data: PostLikePayload): Promise<number> {
    return await PostModel.like(data);
  }

  static async isPostLiked(user_id: number, post_id: number): Promise<boolean> {
    return await PostModel.isLike({ user_id: user_id, post_id: post_id });
  }

  static async unlikePost(data: PostLikePayload): Promise<number> {
    const deleted = await PostModel.unLike(data);
    if (deleted === 0) throw new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404);
    return deleted; //number of items deleted.
  }

  static async increaseLikeCount(
    postId: number,
    count: number = 1
  ): Promise<number> {
    return await PostModel.increaseLikeCount(postId, count);
  }

  static async decreaseLikeCount(
    postId: number,
    count: number = 1
  ): Promise<number> {
    return PostModel.decreaseLikeCount(postId);
  }

  static async increaseCommentCount(
    postId: number,
    count: number = 1
  ): Promise<number> {
    return PostModel.increaseCommentCount(postId, count);
  }

  static async decreaseCommentCount(
    postId: number,
    count: number = 1
  ): Promise<number> {
    return PostModel.decreaseCommentCount(postId, count);
  }
}
