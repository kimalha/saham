'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('criteria', [
      {
        code: 'C1_PE',
        name: 'PE Ratio',
        type: 'cost',
        default_weight: 25.00,
        description: 'Price to Earnings Ratio - Mengukur kemurahan harga saham.'
      },
      {
        code: 'C2_ROE',
        name: 'Return on Equity',
        type: 'benefit',
        default_weight: 25.00,
        description: 'Return on Equity - Mengukur kemampuan menghasilkan laba bersih dari ekuitas.'
      },
      {
        code: 'C3_DER',
        name: 'Debt to Equity Ratio',
        type: 'cost',
        default_weight: 25.00,
        description: 'Debt to Equity Ratio - Mengukur rasio utang terhadap ekuitas perusahaan.'
      },
      {
        code: 'C4_DIV',
        name: 'Dividend Yield',
        type: 'benefit',
        default_weight: 25.00,
        description: 'Dividend Yield - Mengukur persentase dividen terhadap harga saham.'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('criteria', null, {});
  }
};
