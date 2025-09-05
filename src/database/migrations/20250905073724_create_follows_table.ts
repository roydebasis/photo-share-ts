import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("follows", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("follower_id").unsigned().notNullable();
    table.bigInteger("followee_id").unsigned().notNullable();
    table.timestamps(true, true);

    table.unique(["follower_id", "followee_id"]);
    table
      .foreign("follower_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("followee_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.index("followee_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("follows");
}
