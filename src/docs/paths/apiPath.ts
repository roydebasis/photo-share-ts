import { commonParameters } from "../parameters/commonParameters";
import { commonSchema } from "../schemas/commonSchema";

// Manual API Paths
export const apiPaths = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "User login",
      description: "Login with email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Debasis Roy" },
                email: { type: "string", example: "ry.debasis@gmail.com" },
                password: { type: "string", example: "Password123!" },
                files: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: commonSchema.Success,
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result_code: { type: "number", example: 401 },
                  date: { type: "number", example: 1738653531000 },
                  status: { type: "string", example: "error" },
                  message: { type: "string", example: "Invalid credentials" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "User login",
      description: "Login with email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string", example: "ry.debasis@gmail.com" },
                password: { type: "string", example: "Password123!" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: commonSchema.Success,
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result_code: { type: "number", example: 401 },
                  date: { type: "number", example: 1738653531000 },
                  status: { type: "string", example: "error" },
                  message: { type: "string", example: "Invalid credentials" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/reset-password": {
    post: {
      tags: ["Authentication"],
      summary: "Reset password",
      description: "Get new access token using refresh token",
      // parameters: [commonParameters.clientType, commonParameters.clientVersion],
      responses: {
        "200": {
          description: "Token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  access_token: { type: "string" },
                  refresh_token: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/user/create": {
    post: {
      tags: ["User"],
      summary: "Create a new user",
      description: "Create a new user with email and password",
      // parameters: [commonParameters.clientType, commonParameters.clientVersion],
      requestBody: {
        required: true,
      },
      responses: {
        "200": {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: commonSchema.Success,
            },
          },
        },
      },
    },
  },
  ["/posts"]: {
    post: {
      summary: "Create post",
      tags: ["Post"],
      parameters: [commonParameters.token],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                caption: { type: "string", example: "Debasis Roy" },
                visibility: {
                  type: "string",
                  enum: ["public", "private", "friends", "custom"],
                  example: "public",
                },
                files: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Post created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Post creted successfully",
                  },
                  result: {
                    type: "object",
                    properties: {
                      id: { type: "number", example: 22 },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  errors: {
                    properties: {
                      common: {
                        properties: {
                          msg: {
                            type: "string",
                            example: "Authentication failed",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  errors: {
                    properties: {
                      common: {
                        properties: {
                          msg: {
                            type: "string",
                            example: "Bad Request",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  errors: {
                    properties: {
                      common: {
                        properties: {
                          msg: {
                            type: "string",
                            example: "Internal server error.",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    get: {
      summary: "Get post",
      tags: ["Post"],
      responses: {
        "200": {
          description: "Retrieved successfully",
          content: {
            "application/json": {
              schema: commonSchema.Success,
            },
          },
        },
      },
    },
  },
};
