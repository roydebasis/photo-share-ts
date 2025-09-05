import { knex, Knex } from "knex";
import { APP_CONFIG } from "./appConfiguration";

const configurations = {
  mysql: {
    host: APP_CONFIG.db.host,
    user: APP_CONFIG.db.user,
    password: APP_CONFIG.db.password,
    database: APP_CONFIG.db.name,
  },
};

export const knex_config: Knex.Config = {
  client: "mysql2",
  connection: configurations.mysql,
  migrations: {
    directory: "./src/database/migrations",
  },
  seeds: {
    directory: "./src/database/seeds",
  },
};

export const dbInstance = knex({
  client: "mysql2",
  connection: configurations.mysql,
  compileSqlOnError: false,
});
