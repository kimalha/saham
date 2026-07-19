'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('stocks', 'sector', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'Lainnya'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('stocks', 'sector');
  }
};
