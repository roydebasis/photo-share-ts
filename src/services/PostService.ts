import { PaginationResult, Params } from "../interfaces/DBQuery.Interface";
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
    if (!post) throw new Error("Post not found.");
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
    if (deleted === 0) throw new Error("Post not found.");
    return deleted;
  }
}
