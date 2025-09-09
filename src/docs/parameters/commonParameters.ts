export const commonParameters = {
  token: {
    name: "Token",
    in: "header",
    required: true,
    description: "Put the token generated from login api",
    schema: {
      type: "string",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    },
  },
};
