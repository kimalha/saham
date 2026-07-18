import { TopsisService } from '../src/services/topsis.service';
import { TopsisStockInput, TopsisWeightsInput } from '../src/types/topsis.types';

describe('TOPSIS Engine Mathematical Logic Tests', () => {
  // Data dummy saham LQ45 awal sesuai database.md
  const mockStocks: TopsisStockInput[] = [
    { id: 1, code: 'BBCA', pe_ratio: 24.5, roe: 19.2, der: 0.15, dividend_yield: 2.1 },
    { id: 2, code: 'BBRI', pe_ratio: 15.2, roe: 18.5, der: 0.85, dividend_yield: 4.3 },
    { id: 3, code: 'TLKM', pe_ratio: 18.1, roe: 16.8, der: 0.7, dividend_yield: 4.8 },
    { id: 4, code: 'ASII', pe_ratio: 8.9, roe: 14.5, der: 0.9, dividend_yield: 6.2 },
    { id: 5, code: 'UNVR', pe_ratio: 30.1, roe: 85.0, der: 2.1, dividend_yield: 5.5 }
  ];

  // Bobot setimbang 25% masing-masing (Total 100%)
  const validWeights: TopsisWeightsInput = {
    pe_ratio: 25.0,
    roe: 25.0,
    der: 25.0,
    dividend_yield: 25.0
  };

  test('should successfully run TOPSIS calculation with valid inputs', () => {
    const result = TopsisService.analyze(mockStocks, validWeights);

    // Verifikasi struktur data output
    expect(result).toHaveProperty('ranking');
    expect(result).toHaveProperty('calculation_steps');
    expect(result.ranking.length).toBe(5);

    // Pastikan perankingan dari rank 1 sampai 5 berurutan
    const ranks = result.ranking.map(item => item.rank);
    expect(ranks).toEqual([1, 2, 3, 4, 5]);

    // Pastikan preference_score bernilai antara 0 dan 1 secara berurutan menurun (descending)
    for (let i = 0; i < result.ranking.length - 1; i++) {
      expect(result.ranking[i].preference_score).toBeGreaterThanOrEqual(
        result.ranking[i + 1].preference_score
      );
      expect(result.ranking[i].preference_score).toBeLessThanOrEqual(1.0);
      expect(result.ranking[i].preference_score).toBeGreaterThanOrEqual(0.0);
    }

    // Memastikan steps kalkulasi matriks memiliki ukuran yang sesuai
    expect(result.calculation_steps.matrix_d.length).toBe(5);
    expect(result.calculation_steps.matrix_d[0].length).toBe(4);
    expect(result.calculation_steps.matrix_r.length).toBe(5);
    expect(result.calculation_steps.matrix_y.length).toBe(5);
    expect(result.calculation_steps.ideal_solutions.positive.length).toBe(4);
    expect(result.calculation_steps.ideal_solutions.negative.length).toBe(4);
    expect(result.calculation_steps.distances.length).toBe(5);
  });

  test('should throw error when total weights is not equal to 100%', () => {
    const invalidWeights: TopsisWeightsInput = {
      pe_ratio: 20.0,
      roe: 25.0,
      der: 25.0,
      dividend_yield: 25.0 // Total: 95%
    };

    expect(() => {
      TopsisService.analyze(mockStocks, invalidWeights);
    }).toThrow('Total bobot kriteria harus tepat 100%');
  });

  test('should throw error when stocks list is empty', () => {
    expect(() => {
      TopsisService.analyze([], validWeights);
    }).toThrow('Daftar alternatif saham tidak boleh kosong');
  });

  test('should correctly handle benefit vs cost criteria optimization', () => {
    const result = TopsisService.analyze(mockStocks, validWeights);

    // Kriteria index: 0 = PE (Cost), 1 = ROE (Benefit), 2 = DER (Cost), 3 = DIV (Benefit)
    const idealPos = result.calculation_steps.ideal_solutions.positive;
    const idealNeg = result.calculation_steps.ideal_solutions.negative;

    // Untuk Cost (PE dan DER), solusi ideal positif haruslah nilai yang MINIMUM
    // Kita pastikan ideal positif index 0 (PE) dan 2 (DER) lebih kecil/sama dengan ideal negatifnya
    expect(idealPos[0]).toBeLessThanOrEqual(idealNeg[0]);
    expect(idealPos[2]).toBeLessThanOrEqual(idealNeg[2]);

    // Untuk Benefit (ROE dan DIV), solusi ideal positif haruslah nilai yang MAXIMUM
    // Kita pastikan ideal positif index 1 (ROE) dan 3 (DIV) lebih besar/sama dengan ideal negatifnya
    expect(idealPos[1]).toBeGreaterThanOrEqual(idealNeg[1]);
    expect(idealPos[3]).toBeGreaterThanOrEqual(idealNeg[3]);
  });
});
