import { Model, DataTypes, Sequelize } from 'sequelize';

export interface StockAttributes {
  id?: number;
  code: string;
  name: string;
  pe_ratio: number;
  roe: number;
  der: number;
  dividend_yield: number;
  created_at?: Date;
  updated_at?: Date;
}

export class Stock extends Model<StockAttributes> implements StockAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public pe_ratio!: number;
  public roe!: number;
  public der!: number;
  public dividend_yield!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export function initStock(sequelize: Sequelize): typeof Stock {
  Stock.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      pe_ratio: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        get() {
          const value = this.getDataValue('pe_ratio');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      roe: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        get() {
          const value = this.getDataValue('roe');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      der: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        get() {
          const value = this.getDataValue('der');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      dividend_yield: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        get() {
          const value = this.getDataValue('dividend_yield');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      }
    },
    {
      sequelize,
      tableName: 'stocks',
      underscored: true,
      timestamps: true
    }
  );

  return Stock;
}
