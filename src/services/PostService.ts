import { APPLICATON_MESSAGES } from "../config/constants";
import { PaginationResult, Params } from "../interfaces/DBQuery.Interface";
import { PostLikePayload } from "../interfaces/LikeInterface";
import { Post } from "../interfaces/Post.Interface";
import PostModel from "../models/PostModel";

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
    if (!post) throw new Error(APPLICATON_MESSAGES.NOT_FOUND);
    return post;
  }

  static async create(post: Omit<Post, "id">): Promise<number> {
    return PostModel.create(post);
  }

  static async update(id: number, post: Partial<Post>): Promise<number> {
    const updated = await PostModel.update(id, post);
    if (updated === 0) throw new Error("Post not found or no changes.");
    return updated;
  }

  static async destory(id: number): Promise<number> {
    const deleted = await PostModel.delete(id);
    if (deleted === 0) throw new Error(APPLICATON_MESSAGES.NOT_FOUND);
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
    if (deleted === 0) throw new Error(APPLICATON_MESSAGES.NOT_FOUND);
    return deleted; //number of items deleted.
  }

  static async comments(postId: number, params: Params) {}
}
