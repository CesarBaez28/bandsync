import { z } from "zod";

export const editUserSchema = z.object({
  firstName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 letras'),
  lastName: z
    .string()
    .min(3, 'El apellido debe tener al menos 3 letras'),
  phone: z
    .string()  
    .min(10, "El número debe tener mínimo 10 dígitos")
})

export type EditUseSchema = z.infer<typeof editUserSchema>;