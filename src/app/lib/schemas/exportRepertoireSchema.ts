import { z } from "zod";

export const exportSchema = z.object({
  repertoire: z
    .string()
    .nonempty("Selecione un repertorio"),
  option: z
    .string()
    .nonempty("Selecione una opción de exportación")
});

export type ExportSchema = z.infer<typeof exportSchema>;