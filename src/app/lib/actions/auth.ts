"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.';
      }

      return 'Lo sentimos. Ocurrió un error inesperado al iniciar sesión. Inténlo de nuevo o trate de hacerlo más tarde.';
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut();
}