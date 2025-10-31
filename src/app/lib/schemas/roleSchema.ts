import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio")
});

export type RoleSchema = z.infer<typeof roleSchema>;