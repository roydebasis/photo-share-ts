import { dbInstance as db } from "../config/database";
import { PaginationResult, Params } from "../interfaces/DBQueryInterface";
import { PostLikePayload } from "../interfaces/LikeInterface";
import { Post } from "../interfaces/PostInterface";

const TABLE = "posts";
const LIKE_TABLE = "likes";

const PostModel = {
  async findAll(
    params: Params,
    includeCreators: number[] = [],
    excludeCreators: number[] = []
  ): Promise<PaginationResult<Post>> {
    const { page, limit, order, sort, search } = params;
    const query = db<Post>(TABLE).select("*");
    const countQuery = db(TABLE).count("id as total").first();

    if (search) {
      query.where("caption", "like", `%${search}%`);
      countQuery.where("caption", "like", `%${search}%`);
    }
    if (includeCreators && includeCreators.length > 0) {
      query.whereIn("user_id", includeCreators);
      countQuery.whereIn("user_id", includeCreators);
    }
    if (excludeCreators && excludeCreators.length > 0) {
      query.whereNotIn("user_id", excludeCreators);
      countQuery.whereNotIn("user_id", excludeCreators);
    }

    const data = await query
      .orderBy(sort, order)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalResult = await countQuery;
    const total = totalResult ? Number(totalResult.total) : 0;
    const total_pages = Math.ceil(total / limit);
    const has_more = page < total_pages;

    return {
      items: data,
      pagination: {
        total,
        page,
        limit,
        total_pages,
        has_more,
      },
    };
  },

  async findById(id: number): Promise<Post | undefined> {
    return db<Post>(TABLE).where({ id }).first();
  },

  async create(post: Omit<Post, "id">): Promise<number> {
    const [id] = await db<Post>(TABLE).insert(post);
    return id;
  },

  async update(id: number, post: Partial<Post>): Promise<number> {
    return db<Post>(TABLE).where({ id }).update(post);
  },

  async delete(id: number): Promise<number> {
    return db<Post>(TABLE).where({ id }).del();
  },

  async like(data: PostLikePayload): Promise<number> {
    const [id] = await db<Post>(LIKE_TABLE).insert(data);
    return id;
  },

  async isLike(criteria: { [key: string]: any }): Promise<boolean> {
    const row = await db(LIKE_TABLE).where(criteria).select(1).first();
    return !!row;
  },

  async unLike(criteria: { [key: string]: any }): Promise<number> {
    return db(LIKE_TABLE).where(criteria).del();
  },

  async increaseLikeCount(postId: number, count: number = 1): Promise<number> {
    return db(TABLE).where("id", postId).increment("likes_count", count);
  },

  async decreaseLikeCount(postId: number, count: number = 1): Promise<number> {
    return db(TABLE).where("id", postId).decrement("likes_count", count);
  },

  async increaseCommentCount(
    postId: number,
    count: number = 1
  ): Promise<number> {
    return db(TABLE).where("id", postId).increment("comments_count", count);
  },

  async decreaseCommentCount(
    postId: number,
    count: number = 1
  ): Promise<number> {
    return db(TABLE).where("id", postId).decrement("comments_count", count);
  },
};

export default PostModel;
