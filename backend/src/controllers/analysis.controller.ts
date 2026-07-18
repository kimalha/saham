import { Request, Response, NextFunction } from 'express';
import { StockRepository } from '../repositories/stock.repository';
import { HistoryRepository } from '../repositories/history.repository';
import { TopsisService } from '../services/topsis.service';
import { TopsisStockInput } from '../types/topsis.types';

export class AnalysisController {
  public static async run(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, stock_ids, weights } = req.body;

      let targetStocks: any[] = [];

      if (stock_ids && stock_ids.length > 0) {
        // Ambil data saham sesuai array ID yang dikirim
        const fetchPromises = stock_ids.map((id: number) => StockRepository.findById(id));
        const results = await Promise.all(fetchPromises);
        targetStocks = results.filter(s => s !== null);
      } else {
        // Default: Ambil semua data saham di database jika ID tidak dispesifikasikan
        targetStocks = await StockRepository.findAll();
      }

      if (targetStocks.length < 2) {
        res.status(400).json({
          status: 'error',
          message: 'Dibutuhkan minimal 2 data saham di database untuk melakukan analisis perbandingan',
          code: 'INSUFFICIENT_DATA'
        });
        return;
      }

      // Petakan model Sequelize ke tipe input TOPSIS service
      const topsisInputs: TopsisStockInput[] = targetStocks.map(stock => ({
        id: stock.id,
        code: stock.code,
        pe_ratio: stock.pe_ratio,
        roe: stock.roe,
        der: stock.der,
        dividend_yield: stock.dividend_yield
      }));

      // Eksekusi core TOPSIS engine
      const analysisResult = TopsisService.analyze(topsisInputs, weights);

      // Simpan hasil ke riwayat analisis database
      const savedHistory = await HistoryRepository.create({
        title,
        weight_pe: weights.pe_ratio,
        weight_roe: weights.roe,
        weight_der: weights.der,
        weight_div: weights.dividend_yield,
        results_data: analysisResult
      });

      res.status(200).json({
        status: 'success',
        data: {
          history_id: savedHistory.id,
          title: savedHistory.title,
          created_at: savedHistory.created_at,
          ranking: analysisResult.ranking,
          calculation_steps: analysisResult.calculation_steps
        }
      });
    } catch (error: any) {
      if (error.message && error.message.includes('bobot')) {
        res.status(400).json({
          status: 'error',
          message: error.message,
          code: 'INVALID_WEIGHTS'
        });
        return;
      }
      next(error);
    }
  }
}
