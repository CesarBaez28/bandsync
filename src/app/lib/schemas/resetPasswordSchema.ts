import { z } from "zod";

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La nueva contraseña debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una letra mayúscula")
    .regex(/\d/, "La nueva contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La nueva contraseña debe contener al menos un carácter especial"),
  confirmPassword: z
    .string()
    .min(8, "La confirmación de la nueva contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La confirmación de la nueva contraseña debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "La confirmación de la nueva contraseña debe contener al menos una letra mayúscula")
    .regex(/\d/, "La confirmación de la nueva contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La confirmación de la nueva contraseña debe contener al menos un carácter especial"),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Las contraseñas no coinciden.',
    });
  }
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;