// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { ENV } from './config/env.config';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';
import { ApiResponse } from './interfaces/api.interface';

const app: Application = express();

// Middlewares Globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Reemplazamos Morgan con Pino-HTTP para logs de red ultra-rápidos
app.use(pinoHttp({ logger }));

// Healthcheck Endpoint estandarizado con la nueva Interfaz
app.get(`${ENV.API_PREFIX}/health`, (req: Request, res: Response) => {
  const response: ApiResponse<{ service: string; environment: string }> = {
    success: true,
    data: {
      service: 'ARCHIVE Data Engine',
      environment: ENV.NODE_ENV,
    },
    meta: { timestamp: new Date().toISOString() },
  };
  res.status(200).json(response);
});

// Middleware genérico para rutas no encontradas (404) que dispara nuestro AppError
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Ruta ${req.originalUrl} no encontrada en el motor`, 404));
});

// EL MIDDLEWARE DE ERRORES SIEMPRE VA AL FINAL
app.use(errorHandler);

export default app;