import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().notNullable();
    table.text("caption").nullable();
    table.string("filename", 255).notNullable();
    table.string("original_filename", 255).nullable();
    table.enum("media_type", ["image", "video", "gif"]).defaultTo("image");
    table.string("mime_type", 255).nullable();
    table.integer("size").defaultTo(0);
    table.integer("likes_count").defaultTo(0);
    table.integer("comments_count").defaultTo(0);
    table
      .enum("visibility", ["public", "private", "friends", "custom"])
      .defaultTo("public");
    table.json("visibility_options").nullable();
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("posts");
}
