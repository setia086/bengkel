import { z } from "zod";

export const pembayaranSchema = z.object({
  servisId: z.number().int().positive(),
  metode: z.enum([
    "Tunai",
    "Transfer",
    "QRIS",
    "QRIS - BCA",
    "QRIS - BNI",
    "QRIS - BRI",
    "QRIS - Mandiri",
    "QRIS - CIMB Niaga",
    "QRIS - Permata",
    "Debit",
  ]),
  dibayar: z.number().positive(),
});