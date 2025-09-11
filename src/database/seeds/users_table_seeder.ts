import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Knex } from "knex";
import { APP_CONFIG } from "../../config/appConfig";
dotenv.config();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex: Knex): Promise<void> {
  let tableName = "users";
  const passwordHash = await bcrypt.hash("123456", APP_CONFIG.saltRounds);
  // Deletes ALL existing entries
  await knex(tableName).del();
  await knex(tableName).insert([
    {
      id: 1,
      name: "Debasis",
      username: "debasis",
      email: "debasis@test.com",
      password: passwordHash,
      role: "admin",
      avatar: null,
      mobile: "9876543210",
      gender: "male",
      status: "active",
    },
    {
      id: 2,
      name: "John",
      username: "john",
      email: "john@test.com",
      password: passwordHash,
      role: "moderator",
      avatar: null,
      mobile: "9876543210",
      gender: "male",
      status: "active",
    },
    {
      id: 3,
      name: "Jane",
      username: "jane",
      email: "jane@test.com",
      password: passwordHash,
      role: "user",
      avatar: null,
      mobile: "9876543210",
      gender: "female",
      status: "active",
    },
    {
      id: 4,
      name: "Jim",
      username: "jim",
      email: "jim@test.com",
      password: passwordHash,
      role: "user",
      avatar: null,
      mobile: "9876543210",
      gender: "male",
      status: "active",
    },
    {
      id: 5,
      name: "Jill",
      username: "jill",
      email: "jill@test.com",
      password: passwordHash,
      role: "user",
      avatar: null,
      mobile: "9876543210",
      gender: "female",
      status: "active",
    },
    {
      id: 6,
      name: "Jack",
      username: "jack",
      email: "jack@test.com",
      password: passwordHash,
      role: "user",
      avatar: null,
      mobile: "9876543210",
      gender: "male",
      status: "active",
    },
  ]);
};
