import { Request, Response, NextFunction } from 'express';
import { HistoryRepository } from '../repositories/history.repository';
import { ExportService } from '../services/export.service';

export class ExportController {
  public static async exportPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const pdfBuffer = await ExportService.generatePdf(history);
      
      const fileName = `Laporan_TOPSIS_${history.title.replace(/\s+/g, '_')}_${id}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.end(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  public static async exportExcel(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const excelBuffer = await ExportService.generateExcel(history);
      
      const fileName = `Laporan_TOPSIS_${history.title.replace(/\s+/g, '_')}_${id}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.end(excelBuffer);
    } catch (error) {
      next(error);
    }
  }
}
