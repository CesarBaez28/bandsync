import { z } from "zod";

export const userRoleSchema = z.object({
  role: z
    .string()
    .nonempty("Seleccione un rol")
});

export type UserRoleSchema = z.infer<typeof userRoleSchema>;