import { Model, DataTypes, Sequelize } from 'sequelize';

export interface CriteriaAttributes {
  id?: number;
  code: string;
  name: string;
  type: 'benefit' | 'cost';
  default_weight: number;
  description?: string;
}

export class Criteria extends Model<CriteriaAttributes> implements CriteriaAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public type!: 'benefit' | 'cost';
  public default_weight!: number;
  public description?: string;
}

export function initCriteria(sequelize: Sequelize): typeof Criteria {
  Criteria.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('benefit', 'cost'),
        allowNull: false
      },
      default_weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('default_weight');
          return value === null ? null : parseFloat(value as unknown as string);
        }
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'criteria',
      underscored: true,
      timestamps: false
    }
  );

  return Criteria;
}
