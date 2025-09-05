import { commonParameters } from "../parameters/common.parameters";
import { commonSchema } from "../schemas/common.schema";

// Manual API Paths
export const apiPaths = {
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "User login",
      description: "Login with email and password",
      parameters: [commonParameters.clientType, commonParameters.clientVersion],
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
  "/auth/refresh-token": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      description: "Get new access token using refresh token",
      parameters: [commonParameters.clientType, commonParameters.clientVersion],
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
  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "User logout",
      description: "Logout user and invalidate tokens",
      parameters: [commonParameters.clientType, commonParameters.clientVersion],
      responses: {
        "200": {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result_code: { type: "number", example: 200 },
                  status: { type: "string", example: "success" },
                  message: { type: "string", example: "Logout successful" },
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
      parameters: [commonParameters.clientType, commonParameters.clientVersion],
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
  ["/upload-file"]: {
    post: {
      summary: "Upload a file",
      tags: ["Upload"],
      parameters: [commonParameters.clientType, commonParameters.clientVersion],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "File uploaded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "File uploaded successfully",
                  },
                  result: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      fileable_type: { type: "string" },
                      fileable_id: { type: "number" },
                      blob_name: { type: "string" },
                      original_name: { type: "string" },
                      file_url: { type: "string" },
                      file_type: { type: "string" },
                      mime_type: { type: "string" },
                      file_size: { type: "number" },
                      slug: { type: "string" },
                      public_url: { type: "string" },
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
  ["/delete-file"]: {
    delete: {
      summary: "Delete a file",
      tags: ["Upload"],
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
                      uploaded_by: { type: "number" },
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
