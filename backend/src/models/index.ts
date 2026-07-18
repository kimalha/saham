import { Sequelize } from 'sequelize';
import { initStock, Stock } from './stock.model';
import { initCriteria, Criteria } from './criteria.model';
import { initAnalysisHistory, AnalysisHistory } from './history.model';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config/database')[env];

let sequelize: Sequelize;

if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Inisialisasi Model
initStock(sequelize);
initCriteria(sequelize);
initAnalysisHistory(sequelize);

export { sequelize, Sequelize, Stock, Criteria, AnalysisHistory };
