import request from "supertest";

import app from "../src/app";

import { describe, expect, it } from "vitest";

describe("#app", () => {
  it("responds with a not found message", () => {
    return request(app)
      .get("/api/v1/comments")
      .set("Accept", "Application/json")
      .expect("Content-Type", /json/)
      .expect(404);
  });
});
