export interface TopsisStockInput {
  id: number;
  code: string;
  pe_ratio: number;
  roe: number;
  der: number;
  dividend_yield: number;
}

export interface TopsisWeightsInput {
  pe_ratio: number;
  roe: number;
  der: number;
  dividend_yield: number;
}

export interface TopsisResult {
  id: number;
  code: string;
  preference_score: number;
  rank: number;
}

export interface TopsisDistanceResult {
  id: number;
  d_plus: number;
  d_minus: number;
}

export interface TopsisCalculationSteps {
  matrix_d: number[][]; // Matriks keputusan awal (m x 4)
  matrix_r: number[][]; // Matriks ternormalisasi (m x 4)
  matrix_y: number[][]; // Matriks ternormalisasi terbobot (m x 4)
  ideal_solutions: {
    positive: number[]; // Solusi ideal positif A+ (1 x 4)
    negative: number[]; // Solusi ideal negatif A- (1 x 4)
  };
  distances: TopsisDistanceResult[]; // Jarak alternatif ke solusi ideal
}

export interface TopsisAnalysisOutput {
  ranking: TopsisResult[];
  calculation_steps: TopsisCalculationSteps;
}
