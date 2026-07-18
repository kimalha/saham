# TOPSIS Mathematical Algorithm

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini menjelaskan dasar teori, langkah-langkah formulasi matematika, serta contoh implementasi kode program untuk algoritma **TOPSIS** (Technique for Order Preference by Similarity to Ideal Solution) yang digunakan dalam aplikasi ini.

---

## 1. Langkah-Langkah Matematika Metode TOPSIS

Metode TOPSIS didasarkan pada konsep bahwa alternatif terpilih tidak hanya harus memiliki jarak terpendek dari solusi ideal positif, tetapi juga memiliki jarak terpanjang dari solusi ideal negatif.

Berikut adalah 7 tahapan matematis algoritma TOPSIS:

### Langkah 1: Membentuk Matriks Keputusan ($D$)
Matriks keputusan terdiri dari $m$ alternatif dan $n$ kriteria.
$$D = \begin{pmatrix} 
x_{11} & x_{12} & \cdots & x_{1n} \\ 
x_{21} & x_{22} & \cdots & x_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
x_{m1} & x_{m2} & \cdots & x_{mn} 
\end{pmatrix}$$
Di mana $x_{ij}$ merupakan nilai alternatif ke-$i$ pada kriteria ke-$j$.

---

### Langkah 2: Membuat Matriks Keputusan Ternormalisasi ($R$)
Membagi setiap sel dengan akar kuadrat dari jumlah kuadrat kolomnya (Vector Normalization).
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$

---

### Langkah 3: Membuat Matriks Keputusan Ternormalisasi Terbobot ($Y$)
Mengalikan kolom matriks ternormalisasi ($R$) dengan bobot kriteria ($w_j$) yang dimasukkan oleh pengguna.
$$y_{ij} = w_j \cdot r_{ij}$$

---

### Langkah 4: Menentukan Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$)
* **Solusi Ideal Positif ($A^+$):** 
  Mencari nilai terbaik untuk setiap kriteria.
  $$A^+ = (y_1^+, y_2^+, \cdots, y_n^+)$$
  Di mana:
  * $y_j^+ = \max_i(y_{ij})$ jika kriteria $j$ adalah **Benefit** (ROE, Dividend Yield)
  * $y_j^+ = \min_i(y_{ij})$ jika kriteria $j$ adalah **Cost** (PE Ratio, DER)

* **Solusi Ideal Negatif ($A^-$):**
  Mencari nilai terburuk untuk setiap kriteria.
  $$A^- = (y_1^-, y_2^-, \cdots, y_n^-)$$
  Di mana:
  * $y_j^- = \min_i(y_{ij})$ jika kriteria $j$ adalah **Benefit**
  * $y_j^- = \max_i(y_{ij})$ jika kriteria $j$ adalah **Cost**

---

### Langkah 5: Menghitung Jarak Antara Nilai Setiap Alternatif dengan Solusi Ideal
* **Jarak ke Solusi Ideal Positif ($D_i^+$):**
  $$D_i^+ = \sqrt{\sum_{j=1}^n (y_{ij} - y_j^+)^2}$$
* **Jarak ke Solusi Ideal Negatif ($D_i^-$):**
  $$D_i^- = \sqrt{\sum_{j=1}^n (y_{ij} - y_j^-)^2}$$

---

### Langkah 6: Menghitung Nilai Preferensi untuk Setiap Alternatif ($V_i$)
Nilai kedekatan relatif alternatif $i$ terhadap solusi ideal dihitung sebagai berikut:
$$V_i = \frac{D_i^-}{D_i^+ + D_i^-}$$
Rentang nilai $V_i$ berada di antara $0 \leq V_i \leq 1$. Nilai yang mendekati 1 menandakan alternatif yang lebih disukai.

---

### Langkah 7: Perankingan Alternatif
Urutkan alternatif berdasarkan nilai preferensi ($V_i$) dari yang terbesar hingga terkecil. Alternatif dengan nilai $V_i$ tertinggi merupakan rekomendasi saham terbaik.

---

## 2. Implementasi Algoritma dalam TypeScript

Berikut adalah potongan kode logika bisnis murni (*pure function*) yang menerapkan perhitungan TOPSIS secara lengkap:

```typescript
interface Stock {
  id: number;
  code: string;
  pe_ratio: number; // Cost
  roe: number;      // Benefit
  der: number;      // Cost
  dividend_yield: number; // Benefit
}

interface Weights {
  pe_ratio: number;
  roe: number;
  der: number;
  dividend_yield: number;
}

interface TopsisResult {
  stockId: number;
  code: string;
  preferenceScore: number;
  rank: number;
}

export function calculateTopsis(stocks: Stock[], weights: Weights): TopsisResult[] {
  const m = stocks.length;
  if (m === 0) return [];

  // Kriteria Pemetaan Index: 0 = PE, 1 = ROE, 2 = DER, 3 = DIV
  const criteriaKeys: (keyof Weights)[] = ['pe_ratio', 'roe', 'der', 'dividend_yield'];
  const criteriaTypes: ('cost' | 'benefit')[] = ['cost', 'benefit', 'cost', 'benefit'];
  
  // Ambil array bobot (dinormalisasi menjadi fraksi desimal jika totalnya 100%)
  const w = criteriaKeys.map(key => weights[key] / 100);

  // 1. Ekstrak Matriks Keputusan Awal (D)
  const D: number[][] = stocks.map(s => [s.pe_ratio, s.roe, s.der, s.dividend_yield]);

  // 2. Normalisasi Matriks (R)
  const divider: number[] = new Array(4).fill(0);
  for (let j = 0; j < 4; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      sumSq += D[i][j] * D[i][j];
    }
    divider[j] = Math.sqrt(sumSq);
  }

  const R: number[][] = D.map(row => 
    row.map((val, j) => divider[j] === 0 ? 0 : val / divider[j])
  );

  // 3. Matriks Ternormalisasi Terbobot (Y)
  const Y: number[][] = R.map(row => 
    row.map((val, j) => val * w[j])
  );

  // 4. Tentukan Solusi Ideal Positif (A+) dan Negatif (A-)
  const A_plus: number[] = [];
  const A_minus: number[] = [];

  for (let j = 0; j < 4; j++) {
    const columnValues = Y.map(row => row[j]);
    const isBenefit = criteriaTypes[j] === 'benefit';

    if (isBenefit) {
      A_plus[j] = Math.max(...columnValues);
      A_minus[j] = Math.min(...columnValues);
    } else {
      A_plus[j] = Math.min(...columnValues);
      A_minus[j] = Math.max(...columnValues);
    }
  }

  // 5. Hitung Jarak (D+ dan D-) & 6. Nilai Preferensi (V)
  const results = stocks.map((stock, i) => {
    let dPlusSum = 0;
    let dMinusSum = 0;

    for (let j = 0; j < 4; j++) {
      dPlusSum += Math.pow(Y[i][j] - A_plus[j], 2);
      dMinusSum += Math.pow(Y[i][j] - A_minus[j], 2);
    }

    const dPlus = Math.sqrt(dPlusSum);
    const dMinus = Math.sqrt(dMinusSum);

    const preferenceScore = (dPlus + dMinus === 0) ? 0 : dMinus / (dPlus + dMinus);

    return {
      stockId: stock.id,
      code: stock.code,
      preferenceScore: parseFloat(preferenceScore.toFixed(4)),
      rank: 0 // diisi nanti
    };
  });

  // 7. Perankingan
  results.sort((a, b) => b.preferenceScore - a.preferenceScore);
  results.forEach((item, index) => {
    item.rank = index + 1;
  });

  return results;
}
```
