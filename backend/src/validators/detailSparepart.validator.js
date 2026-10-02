import { z } from "zod";

export const detailSparepartSchema = z.object({
  servisId: z.number().int().positive(),
  sparepartId: z.number().int().positive(),
  jumlah: z.number().int().positive(),
  harga: z.number().positive(),
  subtotal: z.number().positive(),
});