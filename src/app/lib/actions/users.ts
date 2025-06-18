"use server";

import registerUser from "../api/users";
import { ApiResponse, MusicalBand } from "../definitions";
import { formRegisterSchema } from "../schemas/formRegisterSchema";
import { handleAsync } from "../utils";

export type RegisterUserState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function registerAction(prevState: RegisterUserState, formData: FormData): Promise<RegisterUserState> {

  const validatedFields = formRegisterSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const requestBody = {
    username: validatedFields.data.username,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    repeatedPassword: validatedFields.data.confirmPassword,
  };

  const [response, error] = await handleAsync<ApiResponse<MusicalBand>>(registerUser(requestBody));

  if (error) {
    console.error("Error registering user:", error);
    return {
      message: "Ocurrió un error al registrar la cuenta. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: response.success
  }
} 
