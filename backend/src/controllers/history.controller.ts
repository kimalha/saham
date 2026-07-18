import { Request, Response, NextFunction } from 'express';
import { HistoryRepository } from '../repositories/history.repository';

export class HistoryController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const histories = await HistoryRepository.findAll();
      res.status(200).json({
        status: 'success',
        data: histories
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const history = await HistoryRepository.findById(id);

      if (!history) {
        res.status(404).json({
          status: 'error',
          message: 'Riwayat analisis tidak ditemukan',
          code: 'NOT_FOUND'
        });
        return;
      }

      // Format detail response agar setara dengan output analysis.run
      const parsedResults = typeof history.results_data === 'string'
        ? JSON.parse(history.results_data)
        : history.results_data;

      res.status(200).json({
        status: 'success',
        data: {
          history_id: history.id,
          title: history.title,
          created_at: history.created_at,
          weight_pe: history.weight_pe,
          weight_roe: history.weight_roe,
          weight_der: history.weight_der,
          weight_div: history.weight_div,
          ranking: parsedResults.ranking,
          calculation_steps: parsedResults.calculation_steps
        }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const isDeleted = await HistoryRepository.delete(id);

      if (!isDeleted) {
        res.status(404).json({
          status: 'error',
          message: 'Riwayat analisis tidak ditemukan',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Riwayat analisis berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}
