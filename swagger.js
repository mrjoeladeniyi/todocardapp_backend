const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API',
      version: '1.0.0',
      description: 'API documentation for the Todo List app',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Change this to your deployed url in production
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
   apis: [
    './routes/*.js',
    './models/*.js',
    './middleware/*.js'
  ],
   // Path to the API docs in your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;