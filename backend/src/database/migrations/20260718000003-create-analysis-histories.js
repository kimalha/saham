'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('analysis_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      weight_pe: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      weight_roe: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      weight_der: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      weight_div: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      results_data: {
        type: Sequelize.JSON,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('analysis_histories');
  }
};
