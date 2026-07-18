import { AnalysisHistory, AnalysisHistoryAttributes } from '../models/history.model';

export class HistoryRepository {
  public static async findAll(): Promise<AnalysisHistory[]> {
    return await AnalysisHistory.findAll({
      attributes: ['id', 'title', 'weight_pe', 'weight_roe', 'weight_der', 'weight_div', 'created_at'],
      order: [['created_at', 'DESC']]
    });
  }

  public static async findById(id: number): Promise<AnalysisHistory | null> {
    return await AnalysisHistory.findByPk(id);
  }

  public static async create(data: AnalysisHistoryAttributes): Promise<AnalysisHistory> {
    return await AnalysisHistory.create(data);
  }

  public static async delete(id: number): Promise<boolean> {
    const deletedCount = await AnalysisHistory.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
