import { z } from "zod";

export const createArtistSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
});

export type CreateArtistSchema = z.infer<typeof createArtistSchema>;