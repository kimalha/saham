import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })) as any;

      // Menimpa req dengan hasil parser untuk mendukung transform tipe
      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(issue => ({
          field: issue.path.join('.').replace(/^(body|params|query)\./, ''),
          message: issue.message
        }));

        res.status(400).json({
          status: 'error',
          message: 'Validasi payload gagal',
          code: 'VALIDATION_ERROR',
          errors: errorMessages
        });
        return;
      }

      res.status(400).json({
        status: 'error',
        message: 'Request tidak valid',
        code: 'BAD_REQUEST'
      });
    }
  };
