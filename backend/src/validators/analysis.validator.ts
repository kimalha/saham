import { z } from 'zod';

export const runAnalysisSchema = z.object({
  body: z.object({
    title: z
      .string()
      .max(100, 'Judul simulasi maksimal 100 karakter')
      .optional()
      .default(() => `Analisis ${new Date().toLocaleString('id-ID')}`),
    stock_ids: z
      .array(z.number())
      .min(2, 'Pilih minimal 2 saham alternatif untuk dianalisis')
      .optional(),
    weights: z.object({
      pe_ratio: z
        .number({ message: 'Bobot PE Ratio harus berupa angka' })
        .min(0, 'Bobot tidak boleh negatif')
        .max(100, 'Bobot maksimal 100%'),
      roe: z
        .number({ message: 'Bobot ROE harus berupa angka' })
        .min(0, 'Bobot tidak boleh negatif')
        .max(100, 'Bobot maksimal 100%'),
      der: z
        .number({ message: 'Bobot DER harus berupa angka' })
        .min(0, 'Bobot tidak boleh negatif')
        .max(100, 'Bobot maksimal 100%'),
      dividend_yield: z
        .number({ message: 'Bobot Dividend Yield harus berupa angka' })
        .min(0, 'Bobot tidak boleh negatif')
        .max(100, 'Bobot maksimal 100%')
    })
  })
});
