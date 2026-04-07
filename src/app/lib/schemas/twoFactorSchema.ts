import { z } from "zod";

export const twoFactorSchema = z.object({
  code: z
    .string()
    .max(6, "El código debe ser de 6 dígitos")
    .nonempty("Ingrese el código")
});

export type TwoFactorSchema = z.infer<typeof twoFactorSchema>;