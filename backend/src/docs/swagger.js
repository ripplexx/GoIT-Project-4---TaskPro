import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskPro API',
      version: '1.0.0',
      description: 'REST API for the TaskPro Kanban app (auth, boards, columns, cards).',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
  },
  apis: ['./src/routers/*.js'],
});
