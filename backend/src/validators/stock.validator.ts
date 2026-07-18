import { z } from 'zod';

export const createStockSchema = z.object({
  body: z.object({
    code: z
      .string({ message: 'Kode saham wajib diisi' })
      .min(3, 'Kode saham minimal 3 karakter')
      .max(10, 'Kode saham maksimal 10 karakter')
      .regex(/^[A-Z0-9]+$/, 'Kode saham harus berupa huruf kapital alfanumerik'),
    name: z
      .string({ message: 'Nama perusahaan wajib diisi' })
      .min(2, 'Nama perusahaan minimal 2 karakter')
      .max(100, 'Nama perusahaan maksimal 100 karakter'),
    pe_ratio: z
      .number({ message: 'PE Ratio harus berupa angka' }),
    roe: z
      .number({ message: 'ROE harus berupa angka' }),
    der: z
      .number({ message: 'DER harus berupa angka' }),
    dividend_yield: z
      .number({ message: 'Dividend Yield harus berupa angka' })
  })
});

export const updateStockSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID harus berupa angka').transform(Number)
  }),
  body: z.object({
    code: z
      .string()
      .min(3)
      .max(10)
      .regex(/^[A-Z0-9]+$/, 'Kode saham harus berupa huruf kapital alfanumerik')
      .optional(),
    name: z.string().min(2).max(100).optional(),
    pe_ratio: z.number().optional(),
    roe: z.number().optional(),
    der: z.number().optional(),
    dividend_yield: z.number().optional()
  })
});

export const deleteStockSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID harus berupa angka').transform(Number)
  })
});
