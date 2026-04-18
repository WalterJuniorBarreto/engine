import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.config';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev')); // Logger

// Healthcheck Endpoint
app.get(`${ENV.API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    service: 'ARCHIVE Data Engine',
    status: 'Operational',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint no encontrado en ARCHIVE Engine' });
});

export default app;