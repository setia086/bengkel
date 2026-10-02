import { z } from "zod";

export const sparepartSchema = z.object({
  kategoriId: z.number().int().positive(),
  nama: z.string().min(3, "Nama sparepart minimal 3 karakter"),
  merk: z.string().optional(),
  stok: z.number().int().min(0, "Stok tidak boleh negatif"),
  harga: z.number().positive("Harga harus lebih dari 0"),
});