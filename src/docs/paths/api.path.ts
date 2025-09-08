import { commonParameters } from "../parameters/common.parameters";
import { commonSchema } from "../schemas/common.schema";

// Manual API Paths
export const apiPaths = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "User login",
      description: "Login with email and password",
      // parameters: [commonParameters.clientType, commonParameters.clientVersion],
      requestBody: {
        required: true,
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
      // parameters: [commonParameters.clientType, commonParameters.clientVersion],
      requestBody: {
        required: true,
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
      // parameters: [commonParameters.clientType, commonParameters.clientVersion],
      parameters: [
        {
          name: "Token",
          in: "header",
          required: true,
          description: "Put the token generated from login api",
          schema: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                caption: { type: "string" },
                visibility: {
                  type: "string",
                  enum: ["public", "private", "friends", "custom"],
                },
                file: { type: "string", format: "binary" },
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
  },
  ["/posts/{id}"]: {
    put: {
      summary: "Update post",
      tags: ["Post"],
      parameters: [commonParameters.clientType, commonParameters.clientVersion],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                file_name: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "File deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "File deleted successfully",
                  },
                  result: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      file_path: { type: "string" },
                      file_name: { type: "string" },
                      Posted_by: { type: "number" },
                      provider: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        "500": { description: "Internal server error" },
      },
    },
  },
};
