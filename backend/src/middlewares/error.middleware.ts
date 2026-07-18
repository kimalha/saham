import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[Error] Code: ${errorCode}, Status: ${statusCode}`);
  console.error(err.stack);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan internal pada server',
    code: errorCode
  });
};
