import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());

// Routes Dasar untuk Testing Server
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
    message: 'Endpoint not found'
  });
});

// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

export default app;
