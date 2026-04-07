'use server';

import { disable2FA, verify2FA } from "../api/users";
import { ApiResponse } from "../definitions";
import { handleAsync } from "../utils";

export type Verify2FAState = {
  message?: string | null;
  success: boolean;
}

export async function verify2FAAction(prevState: Verify2FAState, formData: FormData) {
  const code = formData.get("code") as string | undefined;
  const secret = formData.get("secret") as string | undefined;

  const [response, error] = await handleAsync<ApiResponse<void>>(verify2FA(code, secret));

  if (error) {
    console.error("Error verifying 2FA code:", error);
    return {
      message: "Ocurrió un error al verificar el código. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: true
  }
}

export type Disable2FAState = {
  message?: string | null;
  success: boolean;
}

export async function disable2FAAction() {
  const [response, error] = await handleAsync<ApiResponse<void>>(disable2FA());

  if (error) {
    console.error("Error disabling 2FA:", error);
    return {
      message: "Ocurrió un error al deshabilitar la autenticación en dos pasos. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: true
  };
}