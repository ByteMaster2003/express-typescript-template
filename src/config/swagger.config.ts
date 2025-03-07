import path from "path";

import swaggerJsdoc, { SwaggerDefinition } from "swagger-jsdoc";

import { AppConfig } from "@/config";

const swaggerDef: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Restaurant Hub",
    description: "Internal API documentation for Restaurant Hub",
    version: "1.0.0",
    contact: {
      name: "Vivek Sahani",
      email: "viveksahani39266@gmail.com"
    }
  },
  servers: [
    {
      url: `http://localhost:${AppConfig.PORT}/api/v1`,
      description: "Development server"
    }
  ],
  tags: [
    {
      name: "Authentication",
      description: "Authentication related operations"
    }
  ]
};

const swaggerSpecs = swaggerJsdoc({
  swaggerDefinition: swaggerDef,
  apis: ["docs/**/*.yml", path.join(__dirname, "../routes/**/*.routes.ts")]
});

export { swaggerSpecs };
