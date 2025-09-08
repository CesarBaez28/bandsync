import { z } from "zod";

export const repertoireSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
  description: z
    .string()
    .or(z.literal('')),
  link: z
    .string()
    .url('El link no es válido').optional()
    .or(z.literal('')),
});

export type RepertoireSchema = z.infer<typeof repertoireSchema>;