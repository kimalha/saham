import { Stock, StockAttributes } from '../models/stock.model';
import { sequelize } from '../models';

export class StockRepository {
  public static async findAll(): Promise<Stock[]> {
    return await Stock.findAll({
      order: [['code', 'ASC']]
    });
  }

  public static async findById(id: number): Promise<Stock | null> {
    return await Stock.findByPk(id);
  }

  public static async findByCode(code: string): Promise<Stock | null> {
    return await Stock.findOne({ where: { code } });
  }

  public static async create(data: StockAttributes): Promise<Stock> {
    return await Stock.create(data);
  }

  public static async update(id: number, data: Partial<StockAttributes>): Promise<Stock | null> {
    const stock = await Stock.findByPk(id);
    if (!stock) return null;
    return await stock.update(data);
  }

  public static async delete(id: number): Promise<boolean> {
    const deletedCount = await Stock.destroy({ where: { id } });
    return deletedCount > 0;
  }

  /**
   * Mengimpor data saham dalam jumlah banyak dalam satu transaksi database.
   * Jika ada error pada salah satu record, transaksi akan di-rollback secara penuh.
   * @param stocksData Array data saham yang akan diimpor
   */
  public static async bulkImport(stocksData: StockAttributes[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      for (const data of stocksData) {
        // Upsert: jika kode saham sudah ada, update rasionya. Jika belum, buat baru.
        const existingStock = await Stock.findOne({
          where: { code: data.code },
          transaction
        });

        if (existingStock) {
          await existingStock.update(
            {
              name: data.name,
              pe_ratio: data.pe_ratio,
              roe: data.roe,
              der: data.der,
              dividend_yield: data.dividend_yield,
              sector: data.sector
            },
            { transaction }
          );
        } else {
          await Stock.create(data, { transaction });
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
