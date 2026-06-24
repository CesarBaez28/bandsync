import { UUID } from "node:crypto";
import { z } from "zod";

export const buildTransferSchema = (bandIds: UUID[]) => {
  const transfersShape: Record<string, z.ZodString> = {};

  bandIds.forEach((id) => {
    transfersShape[id] = z
      .string()
      .min(1, "Debe seleccionar un administrador");
  });

  return z.object({
    transfers: z.object(transfersShape),
  });
};

export type TransferFormData = z.infer<ReturnType<typeof buildTransferSchema>>;