import { z } from "zod";

export const mekanikSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  telepon: z.string().optional(),
  spesialis: z.string().optional(),
});