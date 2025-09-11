import bcrypt from "bcrypt";
import { dbInstance as db } from "../config/database";
import { IUserRow } from "../interfaces/AuthInterface";
import { PaginationResult, Params } from "../interfaces/DBQueryInterface";
import { SafeUserProfile, User } from "../interfaces/UserInterface";
import { AppError } from "../utilities/AppError";

export const createUser = async (userRow: IUserRow): Promise<User> => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
  const passwordHash = await bcrypt.hash(userRow.password, saltRounds);
  const data = userRow;
  data.password = passwordHash;
  try {
    const [insertId] = await db("users").insert(data); // MySQL returns inserted id
    const user = await db("users").where({ id: insertId }).first();
    return user;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: string = "id",
  order: string = "asc"
): Promise<PaginationResult<SafeUserProfile>> => {
  try {
    const users = await db("users")
      .select(
        "id",
        "name",
        "email",
        "mobile",
        "role",
        "gender",
        "avatar",
        "status"
      )
      .where("name", "like", `%${search}%`)
      .orderBy(sort, order)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalResult = await db("users")
      .where("name", "like", `%${search}%`)
      .count("id as total")
      .first();
    const total = totalResult ? Number(totalResult.total) : 0;
    const total_pages = Math.ceil(total / limit);

    return {
      items: users,
      pagination: {
        total,
        page: page,
        limit: limit,
        total_pages,
        has_more: page < total_pages,
      },
    };
  } catch (err: any) {
    throw new AppError(
      `Error fetching user: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      err.code || 500
    );
  }
};

export const findUser = async (
  criteria: { [key: string]: any },
  excludeId: number | null = null
): Promise<User> => {
  try {
    const query = db("users").where(criteria);
    if (excludeId) {
      query.whereNot("id", excludeId);
    }
    return await query.first();
  } catch (err) {
    throw new Error(
      `Error finding user: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

export const updateUser = async (
  criteria: { [key: string]: any },
  data: { [key: string]: any },
  returnCols = ["id", "name", "email", "mobile", "gender", "avatar", "status"]
) => {
  try {
    const result = await db("users").where(criteria).update(data);
    if (returnCols.length) {
      const user = await db("users").where(criteria).select(returnCols).first();
      user.avatar =
        process.env.APP_URL +
        (user.avatar
          ? process.env.BASE_AVATAR_FOLDER + user.avatar
          : "/images/nophoto.png");
      return user;
    }
    return result;
  } catch (err) {
    throw new Error(
      `User update failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

export const followUser = async (followerId: number, followeeId: number) => {
  try {
    const [insertId] = await db("follows").insert({
      follower_id: followerId,
      followee_id: followeeId,
    });
    return insertId;
  } catch (err) {
    throw new Error(
      `Following user failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

export const unFollowUser = async (followerId: number, followeeId: number) => {
  try {
    return await db("follows")
      .where({ follower_id: followerId, followee_id: followeeId })
      .delete();
  } catch (err) {
    throw new Error(
      `Unfollowing user failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

export const isFollowing = async (
  followerId: number,
  followeeId: number
): Promise<Boolean> => {
  try {
    const [rows] = await db.raw(
      `select exists(select 1 from follows where follower_id = ? and followee_id = ?) as is_following`,
      [followerId, followeeId]
    );
    return rows[0].is_following === 1;
  } catch (err) {
    throw new Error(
      `Failed checking following status: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

export const getFollowers = async (userId: string, params: Params) => {
  try {
    const { page, limit, sort, order } = params;

    const allowedSorts = [
      "id",
      "name",
      "email",
      "mobile",
      "role",
      "created_at",
    ];
    const allowedOrders = ["asc", "desc"];
    const sortBy = allowedSorts.includes(sort) ? sort : "id";
    const sortOrder = allowedOrders.includes(order) ? order : "asc";

    let baseQuery = db("follows").where("followee_id", userId);

    const followers = await baseQuery
      .clone()
      .join("users", "follows.follower_id", "=", "users.id")
      .select(
        "follows.id",
        "follows.follower_id",
        "users.name",
        "users.email",
        "users.avatar",
        "follows.created_at as followed_at"
      )
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalResult = await baseQuery.clone().count("id as total").first();
    const total = totalResult ? Number(totalResult.total) : 0;
    const total_pages = Math.ceil(total / limit);

    return {
      item: followers,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        total_pages,
        has_more: page < total_pages,
      },
    };
  } catch (err) {
    throw new Error(
      `Failed fetching followers: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

export const getFollowing = async (userId: string, params: Params) => {
  try {
    const { page, limit, sort, order } = params;

    const allowedSorts = ["id", "created_at"];
    const allowedOrders = ["asc", "desc"];
    const sortBy = allowedSorts.includes(sort) ? sort : "id";
    const sortOrder = allowedOrders.includes(order) ? order : "asc";
    let baseQuery = db("follows").where("follows.follower_id", userId);

    const following = await baseQuery
      .clone()
      .join("users", "follows.followee_id", "=", "users.id")
      .select(
        "follows.id",
        "follows.followee_id",
        "users.name",
        "users.email",
        "users.avatar",
        "follows.created_at as followed_at"
      )
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalResult = await baseQuery.clone().count("id as total").first();
    const total = totalResult ? Number(totalResult.total) : 0;
    const total_pages = Math.ceil(total / limit);

    return {
      data: following,
      pagination: {
        total,
        page: page,
        limit: limit,
        total_pages,
        has_more: page < total_pages,
      },
    };
  } catch (err) {
    throw new Error(
      `Failed fetching following: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};
