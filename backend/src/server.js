import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectMongo } from './db/connectMongo.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { env } from './utils/env.js';
import { swaggerSpec } from './docs/swagger.js';
import router from './routers/index.js';

async function startServer() {
  await connectMongo();

  const app = express();

  // cors() express.json()'dan ÖNCE çalışmalı: body limiti aşılırsa hata cors hiç
  // işlemeden döner, CORS header'ı olmayan yanıtı tarayıcı JS'e göstermez ("Failed to fetch")
  app.use(cors({ origin: env('CLIENT_URL'), credentials: true }));
  // CSP kapalı: bu salt JSON API + Swagger UI, CSP Swagger'ın inline script/style'larını kırar
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '200kb' }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(env('PORT', 3001));
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer();
