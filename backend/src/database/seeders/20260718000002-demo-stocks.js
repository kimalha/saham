'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('stocks', [
      {
        code: 'BBCA',
        name: 'Bank Central Asia Tbk.',
        pe_ratio: 24.5000,
        roe: 19.2000,
        der: 0.1500,
        dividend_yield: 2.1000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BBRI',
        name: 'Bank Rakyat Indonesia Tbk.',
        pe_ratio: 15.2000,
        roe: 18.5000,
        der: 0.8500,
        dividend_yield: 4.3000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TLKM',
        name: 'Telkom Indonesia Tbk.',
        pe_ratio: 18.1000,
        roe: 16.8000,
        der: 0.7000,
        dividend_yield: 4.8000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ASII',
        name: 'Astra International Tbk.',
        pe_ratio: 8.9000,
        roe: 14.5000,
        der: 0.9000,
        dividend_yield: 6.2000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UNVR',
        name: 'Unilever Indonesia Tbk.',
        pe_ratio: 30.1000,
        roe: 85.0000,
        der: 2.1000,
        dividend_yield: 5.5000,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('stocks', null, {});
  }
};
