import { config } from "../config";
import { ApiResponse, UserSesion } from "../definitions";

export async function signInWithApi({ username, password }: { username: string, password: string }): Promise<UserSesion> {
  const response = await fetch(`${config.api}/users/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const result = await response.json();
  return result.data;
}

export async function verifyTwofaLogin({ tempToken, code }: { tempToken: string, code: string }) {
  const response = await fetch(`${config.api}/users/auth/verify-2fa-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tempToken, code }),
  })

  return await response.json();
}

export type ForgotPasswordRequest = {
  email: string;
}

export async function forgotPassword({ email }: ForgotPasswordRequest): Promise<ApiResponse<void>> {
  const response = await fetch(`${config.api}/users/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error processing forgot password request");
  }

  return await response.json();
}

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
}

export async function resetPassword({ token, newPassword }: ResetPasswordRequest): Promise<ApiResponse<void>> {
  const response = await fetch(`${config.api}/users/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token, newPassword })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error resetting password");
  }

  return await response.json();
}