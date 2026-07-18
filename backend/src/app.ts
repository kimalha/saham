import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());

// Routes API Utama
app.use('/api', apiRouter);

// Health Check Route
app.get('/api/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running.'
  });
});

// Wildcard route
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan',
    code: 'ENDPOINT_NOT_FOUND'
  });
});

// Centralized error handler middleware
app.use(errorHandler);

export default app;
