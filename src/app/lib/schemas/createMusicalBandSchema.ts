import { z } from "zod";

export const createMusicalBandSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
  address: z
    .string(),
  phone: z
    .string(),
  email: z
    .string()
    .email({ message: 'Debe ingresar un correo electrónico válido.' })
});

export type CreateMusicalBandSchema = z.infer<typeof createMusicalBandSchema>;