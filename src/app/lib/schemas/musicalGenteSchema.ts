import { z } from "zod";

export const musicalGenreSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
});

export type MusicalGenreSchema = z.infer<typeof musicalGenreSchema>;