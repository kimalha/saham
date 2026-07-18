import { Criteria, CriteriaAttributes } from '../models/criteria.model';

export class CriteriaRepository {
  public static async findAll(): Promise<Criteria[]> {
    return await Criteria.findAll();
  }

  public static async findByCode(code: string): Promise<Criteria | null> {
    return await Criteria.findOne({ where: { code } });
  }

  public static async updateDefaultWeight(code: string, weight: number): Promise<[number]> {
    return await Criteria.update(
      { default_weight: weight },
      { where: { code } }
    );
  }
}
