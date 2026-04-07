import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/\d/, "La contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La nueva contraseña debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una letra mayúscula")
    .regex(/\d/, "La nueva contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La nueva contraseña debe contener al menos un carácter especial"),
  confirmNewPassword: z
    .string()
    .min(8, "La confirmación de la nueva contraseña debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La confirmación de la nueva contraseña debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "La confirmación de la nueva contraseña debe contener al menos una letra mayúscula")
    .regex(/\d/, "La confirmación de la nueva contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La confirmación de la nueva contraseña debe contener al menos un carácter especial"),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmNewPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmNewPassword'],
      message: 'Las contraseñas no coinciden.',
    });
  }
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;