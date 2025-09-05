import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("comments", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().notNullable();
    table.bigInteger("post_id").unsigned().notNullable();
    table.text("comment").notNullable();
    table.bigInteger("parent_id").unsigned().nullable();
    table.timestamps(true, true);

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
      .foreign("parent_id")
      .references("id")
      .inTable("comments")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.index("user_id");
    table.index("post_id");
    table.index("parent_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("comments");
}
