import { Request, Response, NextFunction } from 'express';
import { StockRepository } from '../repositories/stock.repository';
import xlsx from 'xlsx';
import fs from 'fs';

export class StockController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stocks = await StockRepository.findAll();
      res.status(200).json({
        status: 'success',
        data: stocks
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const stock = await StockRepository.findById(id);
      
      if (!stock) {
        res.status(404).json({
          status: 'error',
          message: 'Data saham tidak ditemukan',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: stock
      });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, name } = req.body;
      
      // Validasi apakah kode saham sudah terdaftar
      const existing = await StockRepository.findByCode(code.toUpperCase());
      if (existing) {
        res.status(409).json({
          status: 'error',
          message: `Saham dengan kode "${code.toUpperCase()}" sudah terdaftar`,
          code: 'DUPLICATE_CODE'
        });
        return;
      }

      const newStock = await StockRepository.create({
        ...req.body,
        code: code.toUpperCase()
      });

      res.status(201).json({
        status: 'success',
        message: 'Data saham berhasil ditambahkan',
        data: newStock
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { code } = req.body;

      if (code) {
        const existing = await StockRepository.findByCode(code.toUpperCase());
        if (existing && existing.id !== id) {
          res.status(409).json({
            status: 'error',
            message: `Saham dengan kode "${code.toUpperCase()}" sudah digunakan oleh data lain`,
            code: 'DUPLICATE_CODE'
          });
          return;
        }
        req.body.code = code.toUpperCase();
      }

      const updated = await StockRepository.update(id, req.body);
      if (!updated) {
        res.status(404).json({
          status: 'error',
          message: 'Data saham tidak ditemukan',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Data saham berhasil diperbarui',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const isDeleted = await StockRepository.delete(id);

      if (!isDeleted) {
        res.status(404).json({
          status: 'error',
          message: 'Data saham tidak ditemukan',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Data saham berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }

  public static async bulkImport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          status: 'error',
          message: 'File Excel/CSV wajib diunggah',
          code: 'FILE_REQUIRED'
        });
        return;
      }

      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Parse data sheets ke bentuk array of objects
      const rawData = xlsx.utils.sheet_to_json<any>(sheet);

      // Clean up file upload temporary
      fs.unlinkSync(filePath);

      if (rawData.length === 0) {
        res.status(400).json({
          status: 'error',
          message: 'File yang diunggah tidak memiliki baris data',
          code: 'EMPTY_FILE'
        });
        return;
      }

      // Memvalidasi kolom dan memetakan datanya
      const stocksToImport = rawData.map((row: any, index: number) => {
        // Mendeteksi kolom yang fleksibel case-insensitive
        const code = (row.code || row.Code || row.KODE || row.Kode || '').toString().trim().toUpperCase();
        const name = (row.name || row.Name || row.NAMA || row.Nama || '').toString().trim();
        const sector = (row.sector || row.Sector || row.SEKTOR || row.Sektor || 'Lainnya').toString().trim();
        const pe_ratio = parseFloat(row.pe_ratio ?? row.pe ?? row.PE ?? row.PE_Ratio ?? 0);
        const roe = parseFloat(row.roe ?? row.ROE ?? row.ROE_Percent ?? 0);
        const der = parseFloat(row.der ?? row.DER ?? row.DER_Ratio ?? 0);
        const dividend_yield = parseFloat(row.dividend_yield ?? row.dividend ?? row.DIV ?? row.Dividend_Yield ?? 0);

        if (!code || !name) {
          throw new Error(`Baris ${index + 2}: Kode saham dan nama perusahaan tidak boleh kosong.`);
        }

        if (isNaN(pe_ratio) || isNaN(roe) || isNaN(der) || isNaN(dividend_yield)) {
          throw new Error(`Baris ${index + 2}: Rasio keuangan (PE, ROE, DER, Div Yield) harus berupa angka.`);
        }

        return {
          code,
          name,
          sector,
          pe_ratio,
          roe,
          der,
          dividend_yield
        };
      });

      await StockRepository.bulkImport(stocksToImport);

      res.status(200).json({
        status: 'success',
        message: `Berhasil mengimpor ${stocksToImport.length} data saham.`
      });
    } catch (error: any) {
      // Hapus file sisa jika terjadi error ditengah jalan
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        status: 'error',
        message: error.message || 'Gagal memproses file impor data saham',
        code: 'IMPORT_FAILED'
      });
    }
  }

  /**
   * Simulasi sinkronisasi data dari Financial API (Sesuai FR-05)
   * Mendukung pengambilan data dari Google Sheets API (jika terkonfigurasi)
   */
  public static async syncFinancialData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sheetUrl = process.env.GOOGLE_SHEET_API_URL;
      
      if (sheetUrl) {
        console.log(`Syncing stock data from Google Sheets: ${sheetUrl}`);
        const response = await fetch(sheetUrl);
        if (!response.ok) {
          throw new Error(`Gagal menghubungi Google Sheet API (Status: ${response.status})`);
        }
        
        const result = await response.json() as any;
        if (result.status === 'success' && Array.isArray(result.data)) {
          // Memvalidasi data yang ditarik dari Google Sheets
          const stocksToImport = result.data.map((item: any, index: number) => {
            const code = (item.code || '').toString().trim().toUpperCase();
            const name = (item.name || '').toString().trim();
            const sector = (item.sector || 'Lainnya').toString().trim();
            const pe_ratio = parseFloat(item.pe_ratio ?? 0);
            const roe = parseFloat(item.roe ?? 0);
            const der = parseFloat(item.der ?? 0);
            const dividend_yield = parseFloat(item.dividend_yield ?? 0);

            if (!code || !name) {
              throw new Error(`Data Google Sheets baris ${index + 1}: Kode saham dan nama perusahaan tidak boleh kosong.`);
            }

            return { code, name, sector, pe_ratio, roe, der, dividend_yield };
          });

          await StockRepository.bulkImport(stocksToImport);
          
          res.status(200).json({
            status: 'success',
            message: `Sinkronisasi selesai. Berhasil memperbarui ${stocksToImport.length} data saham dari Google Sheets.`
          });
          return;
        } else {
          throw new Error('Format data dari Google Sheets API tidak valid (harus berupa {status: "success", data: [...]})');
        }
      }

      // Fallback ke data LQ45 statis default jika GOOGLE_SHEET_API_URL tidak diisi
      console.log('GOOGLE_SHEET_API_URL not configured. Using fallback mock data.');
      const mockLQ45Data = [
        { code: 'BBCA', name: 'Bank Central Asia Tbk.', sector: 'Perbankan', pe_ratio: 24.8, roe: 19.5, der: 0.12, dividend_yield: 2.15 },
        { code: 'BBRI', name: 'Bank Rakyat Indonesia Tbk.', sector: 'Perbankan', pe_ratio: 14.8, roe: 18.2, der: 0.81, dividend_yield: 4.45 },
        { code: 'TLKM', name: 'Telkom Indonesia Tbk.', sector: 'Telekomunikasi', pe_ratio: 17.5, roe: 16.5, der: 0.68, dividend_yield: 5.10 },
        { code: 'ASII', name: 'Astra International Tbk.', sector: 'Industri', pe_ratio: 8.5, roe: 15.0, der: 0.88, dividend_yield: 6.40 },
        { code: 'UNVR', name: 'Unilever Indonesia Tbk.', sector: 'Konsumer Primer', pe_ratio: 28.5, roe: 82.0, der: 2.05, dividend_yield: 5.80 },
        { code: 'BMRI', name: 'Bank Mandiri (Persero) Tbk.', sector: 'Perbankan', pe_ratio: 11.5, roe: 21.0, der: 0.90, dividend_yield: 4.80 },
        { code: 'BBNI', name: 'Bank Negara Indonesia Tbk.', sector: 'Perbankan', pe_ratio: 9.8, roe: 15.5, der: 0.85, dividend_yield: 4.10 },
        { code: 'PGAS', name: 'Perusahaan Gas Negara Tbk.', sector: 'Infrastruktur', pe_ratio: 7.2, roe: 11.2, der: 1.10, dividend_yield: 7.50 },
        { code: 'ADRO', name: 'Adaro Energy Indonesia Tbk.', sector: 'Energi', pe_ratio: 5.5, roe: 24.5, der: 0.45, dividend_yield: 12.50 },
        { code: 'PTBA', name: 'Bukit Asam Tbk.', sector: 'Energi', pe_ratio: 6.1, roe: 28.0, der: 0.38, dividend_yield: 15.00 }
      ];

      await StockRepository.bulkImport(mockLQ45Data);

      res.status(200).json({
        status: 'success',
        message: `Sinkronisasi selesai. Berhasil memperbarui data fundamental ${mockLQ45Data.length} saham LQ45.`
      });
    } catch (error) {
      next(error);
    }
  }
}
