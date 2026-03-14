const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeTrade AI REST API',
      version: '1.0.0',
      description: 'A scalable REST API with JWT Authentication and Role-Based Access Control.',
      contact: {
        name: 'PrimeTrade AI Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/v1/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
