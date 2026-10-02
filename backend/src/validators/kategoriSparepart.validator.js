import { z } from "zod";

export const kategoriSparepartSchema = z.object({

  nama: z.string().min(2).max(100),
});