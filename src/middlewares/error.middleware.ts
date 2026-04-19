// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { ApiResponse } from '../interfaces/api.interface';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Error interno del servidor en ARCHIVE Engine';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Solo logueamos el stack trace completo si es un error 500 (Bug crítico)
  if (statusCode === 500) {
    logger.error(err, `[CRITICAL] ${err.message}`);
  } else {
    logger.warn(`[OPERATIONAL] ${statusCode} - ${err.message}`);
  }

  const response: ApiResponse<null> = {
    success: false,
    error: message,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(statusCode).json(response);
};