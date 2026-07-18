import {
  TopsisStockInput,
  TopsisWeightsInput,
  TopsisAnalysisOutput,
  TopsisResult,
  TopsisDistanceResult
} from '../types/topsis.types';

export class TopsisService {
  /**
   * Menjalankan analisis TOPSIS berdasarkan daftar alternatif saham dan bobot kriteria.
   * @param stocks Daftar alternatif saham
   * @param weights Bobot untuk PE, ROE, DER, dan Dividend Yield
   */
  public static analyze(
    stocks: TopsisStockInput[],
    weights: TopsisWeightsInput
  ): TopsisAnalysisOutput {
    const m = stocks.length;
    if (m === 0) {
      throw new Error('Daftar alternatif saham tidak boleh kosong');
    }

    // 1. Validasi Total Bobot (Wajib Tepat 100%)
    const totalWeight =
      weights.pe_ratio + weights.roe + weights.der + weights.dividend_yield;
    
    // Gunakan toleransi kecil untuk mengatasi floating-point error pada pertambahan desimal jika ada
    if (Math.abs(totalWeight - 100) > 0.001) {
      throw new Error(`Total bobot kriteria harus tepat 100%. Total saat ini: ${totalWeight}%`);
    }

    // Pemetaan kriteria
    // Indeks: 0 = PE Ratio (Cost), 1 = ROE (Benefit), 2 = DER (Cost), 3 = Dividend Yield (Benefit)
    const criteriaKeys: (keyof TopsisWeightsInput)[] = [
      'pe_ratio',
      'roe',
      'der',
      'dividend_yield'
    ];
    const criteriaTypes: ('cost' | 'benefit')[] = ['cost', 'benefit', 'cost', 'benefit'];

    // Bobot dinormalisasi menjadi desimal (dibagi 100)
    const w = criteriaKeys.map(key => weights[key] / 100);

    // Langkah 1: Membentuk Matriks Keputusan Awal (D)
    const D: number[][] = stocks.map(s => [
      s.pe_ratio,
      s.roe,
      s.der,
      s.dividend_yield
    ]);

    // Langkah 2: Membuat Matriks Keputusan Ternormalisasi (R)
    const divider: number[] = new Array(4).fill(0);
    for (let j = 0; j < 4; j++) {
      let sumSq = 0;
      for (let i = 0; i < m; i++) {
        sumSq += D[i][j] * D[i][j];
      }
      divider[j] = Math.sqrt(sumSq);
    }

    const R: number[][] = D.map(row =>
      row.map((val, j) => (divider[j] === 0 ? 0 : val / divider[j]))
    );

    // Langkah 3: Membuat Matriks Keputusan Ternormalisasi Terbobot (Y)
    const Y: number[][] = R.map(row =>
      row.map((val, j) => val * w[j])
    );

    // Langkah 4: Menentukan Solusi Ideal Positif (A+) dan Negatif (A-)
    const A_plus: number[] = [];
    const A_minus: number[] = [];

    for (let j = 0; j < 4; j++) {
      const columnValues = Y.map(row => row[j]);
      const isBenefit = criteriaTypes[j] === 'benefit';

      if (isBenefit) {
        A_plus[j] = Math.max(...columnValues);
        A_minus[j] = Math.min(...columnValues);
      } else {
        // Cost: Solusi ideal positif adalah nilai MINIMUM, negatif adalah MAXIMUM
        A_plus[j] = Math.min(...columnValues);
        A_minus[j] = Math.max(...columnValues);
      }
    }

    // Langkah 5: Menghitung Jarak ke Solusi Ideal (D+ dan D-)
    const distances: TopsisDistanceResult[] = stocks.map((stock, i) => {
      let dPlusSum = 0;
      let dMinusSum = 0;

      for (let j = 0; j < 4; j++) {
        dPlusSum += Math.pow(Y[i][j] - A_plus[j], 2);
        dMinusSum += Math.pow(Y[i][j] - A_minus[j], 2);
      }

      return {
        id: stock.id,
        d_plus: parseFloat(Math.sqrt(dPlusSum).toFixed(6)),
        d_minus: parseFloat(Math.sqrt(dMinusSum).toFixed(6))
      };
    });

    // Langkah 6: Menghitung Nilai Preferensi (V)
    const ranking: TopsisResult[] = stocks.map((stock, i) => {
      const dist = distances[i];
      const divider = dist.d_plus + dist.d_minus;
      const preferenceScore = divider === 0 ? 0 : dist.d_minus / divider;

      return {
        id: stock.id,
        code: stock.code,
        preference_score: parseFloat(preferenceScore.toFixed(4)),
        rank: 0 // Akan diisi saat diurutkan
      };
    });

    // Langkah 7: Perankingan Alternatif (Descending)
    ranking.sort((a, b) => b.preference_score - a.preference_score);
    ranking.forEach((item, index) => {
      item.rank = index + 1;
    });

    // Bulatkan matriks untuk output API agar bersih dan presisi
    const roundedD = D.map(row => row.map(v => parseFloat(v.toFixed(4))));
    const roundedR = R.map(row => row.map(v => parseFloat(v.toFixed(4))));
    const roundedY = Y.map(row => row.map(v => parseFloat(v.toFixed(4))));
    const roundedAPlus = A_plus.map(v => parseFloat(v.toFixed(4)));
    const roundedAMinus = A_minus.map(v => parseFloat(v.toFixed(4)));

    return {
      ranking,
      calculation_steps: {
        matrix_d: roundedD,
        matrix_r: roundedR,
        matrix_y: roundedY,
        ideal_solutions: {
          positive: roundedAPlus,
          negative: roundedAMinus
        },
        distances
      }
    };
  }
}
