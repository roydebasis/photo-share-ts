import swaggerJSDoc from "swagger-jsdoc";
import { APP_CONFIG } from "../config/appConfiguration";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "PhotoShare",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: APP_CONFIG.apiBaseUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Path to your API docs
  apis: ["./src/routes/index.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
