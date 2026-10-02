import { z } from "zod";

export const exportSetListSchema = z.object({
  setlist: z
    .string()
    .nonempty("Selecione un set list"),
  option: z
    .string()
    .nonempty("Selecione una opción de exportación")
});

export type ExportSetListSchema = z.infer<typeof exportSetListSchema>;