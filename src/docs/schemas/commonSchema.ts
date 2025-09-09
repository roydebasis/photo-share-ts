export const commonSchema = {
  Success: {
    type: "object",
    required: ["result_code", "status", "message", "result"],
    properties: {
      result_code: { type: "number", example: 200 },
      //   date: { type: "number", example: 1738653531000 },
      status: { type: "string", example: "success" },
      message: { type: "string", example: "Success message" },
      result: {
        type: "object",
        properties: {},
      },
    },
  },
  Error: {
    type: "object",
    required: ["result_code", "status", "title", "error_info", "error"],
    properties: {
      result_code: { type: "number", example: 400 },
      //   date: { type: "number", example: 1738653531000 },
      status: { type: "string", example: "error" },
      title: { type: "string", example: "Error Title" },
      error_info: { type: "string", example: "Error Info" },
      error: { type: "string", example: "Error" },
    },
  },
  PaginationResponse: {
    type: "object",
    properties: {
      total: { type: "number" },
      page: { type: "number" },
      limit: { type: "number" },
      data: { type: "array", items: {} },
      total_pages: { type: "number" },
      current_page: { type: "number" },
      next_page: { type: "number" },
      previous_page: { type: "number" },
    },
  },
};
