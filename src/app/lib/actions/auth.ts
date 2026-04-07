"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { handleAsync } from "../utils";
import { ApiResponse, UserSesion } from "../definitions";
import { verifyTwofaLogin } from "../api/auth";

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

      if (error.type === 'CallbackRouteError' && error.cause?.err?.message) {
        const parsed = JSON.parse(error.cause.err.message)
        redirect(`/two-factor/verify?token=${parsed.tempToken}`);
      }

      return 'Lo sentimos. Ocurrió un error inesperado al iniciar sesión. Inténtelo de nuevo o trate de hacerlo más tarde.';
    }

    throw error;
  }
}

export async function authenticateWith2FA(prevState: string | undefined, formData: FormData) {
  const code = formData.get("code") as string;
  const tempToken = formData.get("tempToken") as string;
  const redirectTo = formData.get("redirectTo") as string;

  const [response, error] = await handleAsync<ApiResponse<UserSesion>>(verifyTwofaLogin({ tempToken, code }));

  if (error) {
    return 'Ocurrió un error al intentar validar el código. Inténtelo de nuevo o trate de hacerlo más tarde'
  }

  if (!response?.success) {
    return response.message
  }

  await signIn("credentials", {
    ...response.data,
    redirectTo: redirectTo
  });
}

export async function signOutAction() {
  await signOut();
}