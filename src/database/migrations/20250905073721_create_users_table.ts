import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 255).notNullable();
    table.string("username", 255).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.enum("role", ["user", "moderator", "admin"]).defaultTo("user");
    table.string("avatar", 255).nullable();
    table.string("mobile", 255).nullable();
    table.enum("gender", ["male", "female", "other"]).nullable();
    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    table.index("name");
    table.index("username");
    table.index("email");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
