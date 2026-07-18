'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pe_ratio: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
      },
      roe: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
      },
      der: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
      },
      dividend_yield: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stocks');
  }
};
