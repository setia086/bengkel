import { z } from "zod";

export const servisSchema = z.object({
  kodeServis: z.string().min(3, "Kode servis wajib diisi"),
  kendaraanId: z.number().int().positive(),
  mekanikId: z.number().int().positive(),
  keluhan: z.string().optional(),
  kilometer: z.number().int().nonnegative().optional(),
  status: z.string().default("Menunggu"),
  totalBiaya: z.number().nonnegative().default(0),
});