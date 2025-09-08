import swaggerJsdoc from "swagger-jsdoc";
import { apiPaths } from "./paths/api.path";
import { commonSchema } from "./schemas/common.schema";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Photo Share API Documentation",
      version: "1.0.0",
      description: "Documentation for using photo share  APIs.",
      contact: {
        name: "Support Team",
        email: "roy.debashish.sj@gmail.com",
      },
      "x-logo": {
        url: "http:/localhost:3000/images/logo.png",
        altText: "Logo",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API V1",
      },
      {
        url: "/api/v2",
        description: "API V2",
      },
    ],
    components: {
      schemas: {
        ...commonSchema,
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      ...apiPaths,
      // Add other path imports here
    },
  },
  apis: ["./src/docs/parameters/*.ts", "./src/docs/paths/*.ts"],
};

export const swaggerUiOptions = {
  customSiteTitle: "API Documentation", // This updates the page title
  //customCss: ".swagger-ui .topbar { display: none }", // Additional custom CSS (optional)
};

export const swaggerSpec = swaggerJsdoc(options);
