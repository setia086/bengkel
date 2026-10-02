import { z } from "zod";

export const pelangganSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit"),

  alamat: z.string().optional(),
});