import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { applicationPort, basePath } from './configs';


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the project',
    },
    servers: [
      {
        url: `http://localhost:${applicationPort}${basePath}`,
        description: 'Development server',
      },
    ],
  },
  apis: process.env.NODE_ENV === 'production' ? ['./dist/routes/proxy.js'] : ['./src/routes/proxy.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  console.log('swaggerDocs', swaggerDocs);  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
