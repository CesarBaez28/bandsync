import { z } from "zod";

export const assingMusicalRolesSchema = z.object({
  role: z
    .string()
    .nonempty("Selecione un role musical"),
});

export type AssingMusicalRolesSchema = z.infer<typeof assingMusicalRolesSchema>;