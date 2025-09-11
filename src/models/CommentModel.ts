import { dbInstance as db } from "../config/database";
import { Comment, CommentPayload } from "../interfaces/CommentInterface";
import {
  PaginationResult,
  Params,
  RawQueryResult,
} from "../interfaces/DBQueryInterface";

const TABLE = "comments";

const CommentModel = {
  async comments(
    post_id: number,
    params: Params
  ): Promise<PaginationResult<Comment>> {
    const { page, limit, order, sort, search } = params;
    const select = [
      `${TABLE}.id as comment_id`,
      `${TABLE}.user_id`,
      `${TABLE}.comment`,
      `${TABLE}.created_at`,
      `users.name`,
      `users.avatar`,
    ];
    const query = db<Comment>(TABLE).where(`${TABLE}.post_id`, post_id);
    const countQuery = db(TABLE)
      .where("post_id", post_id)
      .count("id as total")
      .first();

    const data = await query
      .join("users", "users.id", "comments.user_id")
      .orderBy(`${TABLE}.${sort}`, order)
      .limit(limit)
      .select(select)
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

  async findById(id: number): Promise<Comment | undefined> {
    return db<Comment>(TABLE).where({ id }).first();
  },

  async create(comment: CommentPayload): Promise<number> {
    const [id] = await db<Comment>(TABLE).insert(comment);
    return id;
  },

  async update(id: number, comment: CommentPayload): Promise<number> {
    return db(TABLE).where({ id }).update(comment);
  },

  async delete(id: number): Promise<number> {
    // return db(TABLE).where({ id }).orWhere("parent_id", id).del();

    return db.transaction<number>(async (trx) => {
      // 1. Use a raw query with a recursive CTE to find all descendant IDs
      const descendantIdsResult = await trx.raw<[RawQueryResult[], unknown[]]>(
        `
      WITH RECURSIVE CommentHierarchy AS (
        SELECT id FROM comments WHERE id = ?
        UNION ALL
        SELECT c.id FROM comments c
        JOIN CommentHierarchy ch ON c.parent_id = ch.id
      )
      SELECT id FROM CommentHierarchy;
    `,
        [id]
      );

      // MySQL returns `[rows, fields]` so we access the first element
      // We use a type assertion to tell TypeScript the shape of the data
      const idsToDelete = (descendantIdsResult[0] as RawQueryResult[]).map(
        (row) => row.id
      );
      console.log("idsToDelete: ", idsToDelete);

      // 2. Perform a single delete operation on all the found IDs
      if (idsToDelete.length > 0) {
        await trx("comments").whereIn("id", idsToDelete).del();

        // For MySQL, `del()` returns a number of affected rows
        // We return the number directly.
        return idsToDelete.length;
      }

      // Return 0 if the initial comment was not found
      return 0;
    });
  },
};

export default CommentModel;
