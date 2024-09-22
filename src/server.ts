import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import proxyRouter from './routes/proxy';
const basePath = '/api/v1';
const app = express();

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
          url: `http://localhost:3000${basePath}`,
          description: 'Development server',
        },
    ],
  },
  apis: process.env.NODE_ENV === 'production' ? ['./dist/routes/proxy.js'] : ['./src/routes/proxy.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log('swaggerDocs is ', swaggerDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(basePath, proxyRouter); 
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
export default app;