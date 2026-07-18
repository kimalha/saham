import PDFDocument from 'pdfkit';
import xlsx from 'xlsx';
import { AnalysisHistory } from '../models/history.model';

export class ExportService {
  /**
   * Menghasilkan file PDF laporan ringkas hasil analisis TOPSIS.
   * @param history Data riwayat analisis dari database
   */
  public static async generatePdf(history: AnalysisHistory): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const results = typeof history.results_data === 'string'
        ? JSON.parse(history.results_data)
        : history.results_data;

      // 1. Header Laporan
      doc
        .fillColor('#1E293B')
        .fontSize(20)
        .text('LAPORAN HASIL KEPUTUSAN SAHAM (TOPSIS)', { align: 'center' });
      doc.fontSize(10).fillColor('#64748B').text('Studi Kasus: Saham Ticker Indeks LQ45', { align: 'center' });
      doc.moveDown(2);

      // 2. Metadata Analisis
      doc.fillColor('#0F172A').fontSize(14).text('Detail Simulasi', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#334155');
      doc.text(`Judul Analisis: ${history.title}`);
      doc.text(`Tanggal Perhitungan: ${new Date(history.created_at).toLocaleString('id-ID')}`);
      doc.text(`Metode Pengambilan Keputusan: TOPSIS`);
      doc.moveDown(1.5);

      // 3. Konfigurasi Bobot Kriteria
      doc.fillColor('#0F172A').fontSize(14).text('Konfigurasi Bobot Kriteria', { underline: true });
      doc.moveDown(0.5);
      
      const criteriaData = [
        ['Nama Kriteria', 'Tipe Kriteria', 'Bobot Terpakai (%)'],
        ['PE Ratio', 'Cost', `${history.weight_pe}%`],
        ['Return on Equity', 'Benefit', `${history.weight_roe}%`],
        ['Debt to Equity Ratio', 'Cost', `${history.weight_der}%`],
        ['Dividend Yield', 'Benefit', `${history.weight_div}%`]
      ];

      this.drawTable(doc, criteriaData);
      doc.moveDown(2);

      // 4. Hasil Pemeringkatan
      doc.fillColor('#0F172A').fontSize(14).text('Peringkat Rekomendasi Saham Terbaik', { underline: true });
      doc.moveDown(0.5);

      const rankingRows = [['Rank', 'Kode Saham', 'Skor Preferensi (Vi)']];
      results.ranking.forEach((r: any) => {
        rankingRows.push([`#${r.rank}`, r.code, r.preference_score.toFixed(4)]);
      });

      this.drawTable(doc, rankingRows);

      doc.end();
    });
  }

  /**
   * Menghasilkan file Excel (.xlsx) yang kaya data berisi lembar kerja detail 7 langkah TOPSIS.
   * @param history Data riwayat analisis dari database
   */
  public static async generateExcel(history: AnalysisHistory): Promise<Buffer> {
    const results = typeof history.results_data === 'string'
      ? JSON.parse(history.results_data)
      : history.results_data;

    const steps = results.calculation_steps;
    const ranking = results.ranking;

    // Helper untuk memetakan index baris ke kode saham
    const getStockCode = (rIdx: number) => {
      return ranking[rIdx] ? ranking[rIdx].code : `Saham-${rIdx + 1}`;
    };

    const workbook = xlsx.utils.book_new();

    // Sheet 1: Ringkasan Hasil Peringkat
    const summaryData = [
      ['LAPORAN HASIL KEPUTUSAN SAHAM (TOPSIS)'],
      [`Judul Simulasi: ${history.title}`],
      [`Tanggal: ${new Date(history.created_at).toLocaleString('id-ID')}`],
      [],
      ['Bobot Kriteria yang Digunakan:'],
      ['Kriteria', 'Tipe', 'Bobot (%)'],
      ['PE Ratio', 'Cost', history.weight_pe],
      ['Return on Equity', 'Benefit', history.weight_roe],
      ['Debt to Equity Ratio', 'Cost', history.weight_der],
      ['Dividend Yield', 'Benefit', history.weight_div],
      [],
      ['Hasil Akhir Pemeringkatan:'],
      ['Rank', 'Kode Saham', 'Skor Preferensi (Vi)']
    ];

    ranking.forEach((r: any) => {
      summaryData.push([r.rank, r.code, r.preference_score]);
    });

    const summarySheet = xlsx.utils.aoa_to_sheet(summaryData);
    xlsx.utils.book_append_sheet(workbook, summarySheet, 'Peringkat Akhir');

    // Sheet 2: Matriks Keputusan D
    const dData = [
      ['Matriks Keputusan Awal (D)'],
      [],
      ['Kode Saham', 'PE Ratio (Cost)', 'ROE % (Benefit)', 'DER (Cost)', 'Dividend Yield % (Benefit)']
    ];
    steps.matrix_d.forEach((row: number[], rIdx: number) => {
      dData.push([getStockCode(rIdx), ...row]);
    });
    const dSheet = xlsx.utils.aoa_to_sheet(dData);
    xlsx.utils.book_append_sheet(workbook, dSheet, '1. Matriks D');

    // Sheet 3: Matriks Ternormalisasi R
    const rData = [
      ['Matriks Keputusan Ternormalisasi (R)'],
      [],
      ['Kode Saham', 'PE Ratio', 'ROE', 'DER', 'Dividend Yield']
    ];
    steps.matrix_r.forEach((row: number[], rIdx: number) => {
      rData.push([getStockCode(rIdx), ...row]);
    });
    const rSheet = xlsx.utils.aoa_to_sheet(rData);
    xlsx.utils.book_append_sheet(workbook, rSheet, '2. Matriks R');

    // Sheet 4: Matriks Terbobot Y
    const yData = [
      ['Matriks Ternormalisasi Terbobot (Y)'],
      [],
      ['Kode Saham', 'PE Ratio', 'ROE', 'DER', 'Dividend Yield']
    ];
    steps.matrix_y.forEach((row: number[], rIdx: number) => {
      yData.push([getStockCode(rIdx), ...row]);
    });
    const ySheet = xlsx.utils.aoa_to_sheet(yData);
    xlsx.utils.book_append_sheet(workbook, ySheet, '3. Matriks Y');

    // Sheet 5: Solusi Ideal & Jarak
    const idealData = [
      ['Solusi Ideal Positif & Negatif'],
      [],
      ['Solusi', 'PE Ratio', 'ROE', 'DER', 'Dividend Yield'],
      ['Solusi Ideal Positif (A+)', ...steps.ideal_solutions.positive],
      ['Solusi Ideal Negatif (A-)', ...steps.ideal_solutions.negative],
      [],
      ['Jarak Euclidean & Preferensi'],
      [],
      ['Kode Saham', 'Jarak Ideal+ (D+)', 'Jarak Ideal- (D-)', 'Skor Preferensi (Vi)']
    ];

    steps.distances.forEach((dist: any, rIdx: number) => {
      // Temukan skor preferensi saham
      const score = ranking.find((rk: any) => rk.id === dist.id)?.preference_score || 0;
      idealData.push([getStockCode(rIdx), dist.d_plus, dist.d_minus, score]);
    });

    const idealSheet = xlsx.utils.aoa_to_sheet(idealData);
    xlsx.utils.book_append_sheet(workbook, idealSheet, '4. Ideal & Jarak');

    // Generate buffer xlsx
    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return excelBuffer;
  }

  /**
   * Helper utility untuk menggambar tabel sederhana pada PDF Kit
   */
  private static drawTable(doc: PDFKit.PDFDocument, rows: string[][]) {
    const tableWidth = 500;
    const startX = 50;
    let currentY = doc.y;

    const colWidths = rows[0].map(() => tableWidth / rows[0].length);

    rows.forEach((row, rIdx) => {
      const isHeader = rIdx === 0;

      // Beri background abu-abu gelap untuk header
      if (isHeader) {
        doc.rect(startX, currentY, tableWidth, 20).fill('#334155');
        doc.fillColor('#FFFFFF');
      } else {
        doc.fillColor('#0F172A');
        // Alternating row background
        if (rIdx % 2 === 0) {
          doc.rect(startX, currentY, tableWidth, 18).fill('#F8FAFC');
          doc.fillColor('#0F172A');
        }
      }

      row.forEach((cell, cIdx) => {
        const xOffset = startX + colWidths.slice(0, cIdx).reduce((a, b) => a + b, 0) + 8;
        doc
          .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(isHeader ? 9 : 8)
          .text(cell, xOffset, currentY + (isHeader ? 6 : 5));
      });

      currentY += isHeader ? 20 : 18;
    });

    doc.y = currentY + 10;
  }
}
