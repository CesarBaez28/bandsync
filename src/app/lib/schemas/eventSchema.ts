import { z } from "zod";

export const eventSchema = z.object({
  repertoire: z
    .string()
    .nonempty('Seleccione un repertorio'),
  name: z
    .string()
    .min(3, 'El apellido debe tener al menos 3 letras'),
  date: z
    .string()
    .nonempty('Seleccione una fecha'),
  place: z
    .string()
    .min(3, 'El lugar debe tener al menos 3 letras'),
  location: z
    .string()
    .url('La ubicación debe ser una URL válida'),
  description: z
    .string()
    .optional()
})

export type EventSchema = z.infer<typeof eventSchema>;