import { z } from "zod";

export const createSongSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
  artist: z
    .string()
    .nonempty("Selecione una opción"),
  genre: z
    .string()
    .nonempty("Selecione una opción"),
  tonality: z
    .string()
    .nonempty("Escriba la tonalidad de la canción"),
  link: z
    .string()
    .url('El link no es válido'),
});

export type CreateSongSchema = z.infer<typeof createSongSchema>;