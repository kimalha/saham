'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('stocks', [
      {
        code: 'BBCA',
        name: 'Bank Central Asia Tbk.',
        sector: 'Perbankan',
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
        sector: 'Perbankan',
        pe_ratio: 15.2000,
        roe: 18.5000,
        der: 0.8500,
        dividend_yield: 4.3000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BMRI',
        name: 'Bank Mandiri (Persero) Tbk.',
        sector: 'Perbankan',
        pe_ratio: 11.5000,
        roe: 21.0000,
        der: 0.9000,
        dividend_yield: 4.8000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BBNI',
        name: 'Bank Negara Indonesia Tbk.',
        sector: 'Perbankan',
        pe_ratio: 9.8000,
        roe: 15.5000,
        der: 0.8500,
        dividend_yield: 4.1000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GOTO',
        name: 'GoTo Gojek Tokopedia Tbk.',
        sector: 'Teknologi',
        pe_ratio: -12.5000,
        roe: -8.5000,
        der: 0.0800,
        dividend_yield: 0.0000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ADRO',
        name: 'Adaro Energy Indonesia Tbk.',
        sector: 'Energi',
        pe_ratio: 5.5000,
        roe: 24.5000,
        der: 0.4500,
        dividend_yield: 12.5000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PTBA',
        name: 'Bukit Asam Tbk.',
        sector: 'Energi',
        pe_ratio: 6.1000,
        roe: 28.0000,
        der: 0.3800,
        dividend_yield: 15.0000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ASII',
        name: 'Astra International Tbk.',
        sector: 'Industri',
        pe_ratio: 8.9000,
        roe: 14.5000,
        der: 0.9000,
        dividend_yield: 6.2000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TLKM',
        name: 'Telkom Indonesia Tbk.',
        sector: 'Telekomunikasi',
        pe_ratio: 18.1000,
        roe: 16.8000,
        der: 0.7000,
        dividend_yield: 4.8000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UNVR',
        name: 'Unilever Indonesia Tbk.',
        sector: 'Konsumer Primer',
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
