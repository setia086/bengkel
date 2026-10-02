import { z } from "zod";

export const detailServisSchema = z.object({
  servisId: z.number().int().positive(),
  namaPekerjaan: z.string().min(3, "Nama pekerjaan wajib diisi"),
  biaya: z.number().positive("Biaya harus lebih dari 0"),
});