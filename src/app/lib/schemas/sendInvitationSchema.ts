import { z } from "zod";

export const sendInvitationSchema = z.object({
  email: z
    .string()
    .email("Debe ser un correo electrónico válido")
    .nonempty("El nombre es obligatorio")
});

export type SendInvitationSchema = z.infer<typeof sendInvitationSchema>;