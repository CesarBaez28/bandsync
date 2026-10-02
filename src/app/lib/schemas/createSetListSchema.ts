import { z } from 'zod';

export const createSetListSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
  description: z
    .string()
    .or(z.literal('')),
  repertoire: z
    .string()
    .nonempty("Selecione un repertorio")
})

export type CreateSetListSchema = z.infer<typeof createSetListSchema>;