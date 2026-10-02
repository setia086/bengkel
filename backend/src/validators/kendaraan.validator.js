import { z } from "zod";

export const kendaraanSchema = z.object({
  pelangganId: z.number().int().positive(),
  platNomor: z.string().min(3).max(20),
  merk: z.string().min(2).max(50),
  tipe: z.string().min(2).max(50),

  tahun: z.number().int().min(1900).max(2100).optional(),

  warna: z.string().optional(),
  nomorRangka: z.string().optional(),
  nomorMesin: z.string().optional(),
});