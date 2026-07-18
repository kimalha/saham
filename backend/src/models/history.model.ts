import { Model, DataTypes, Sequelize } from 'sequelize';

export interface AnalysisHistoryAttributes {
  id?: number;
  title: string;
  weight_pe: number;
  weight_roe: number;
  weight_der: number;
  weight_div: number;
  results_data: unknown; // Menyimpan array JSON hasil pemeringkatan dan langkah perhitungan
  created_at?: Date;
}

export class AnalysisHistory extends Model<AnalysisHistoryAttributes> implements AnalysisHistoryAttributes {
  declare id: number;
  declare title: string;
  declare weight_pe: number;
  declare weight_roe: number;
  declare weight_der: number;
  declare weight_div: number;
  declare results_data: unknown;
  declare readonly created_at: Date;
}

export function initAnalysisHistory(sequelize: Sequelize): typeof AnalysisHistory {
  AnalysisHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      weight_pe: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('weight_pe');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      weight_roe: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('weight_roe');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      weight_der: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('weight_der');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      weight_div: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('weight_div');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      results_data: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'analysis_histories',
      underscored: true,
      timestamps: true,
      updatedAt: false // Sesuai skema, hanya memiliki created_at
    }
  );

  return AnalysisHistory;
}
