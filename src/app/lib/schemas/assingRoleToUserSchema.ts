import { z } from "zod";

export const assingRoleToUserSchema = z.object({
  user: z
    .string()
    .nonempty("Selecione un usuario"),
  role: z
    .string()
    .nonempty("Selecione un role")
});

export type AssingRoleToUserSchema = z.infer<typeof assingRoleToUserSchema>;