import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("likes", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().notNullable();
    table.bigInteger("post_id").unsigned().nullable();
    table.bigInteger("comment_id").unsigned().nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    /**
     * A like must belong to either a post or a comment.
     * A like on a post (post_id set, comment_id null).
     * A like on a comment (comment_id set, post_id null).
     */
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("post_id")
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("comment_id")
      .references("id")
      .inTable("comments")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    // Prevent duplicate likes
    table.unique(["user_id", "post_id"]);
    table.unique(["user_id", "comment_id"]);

    table.index("user_id");
    table.index("post_id");
    table.index("comment_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("likes");
}
