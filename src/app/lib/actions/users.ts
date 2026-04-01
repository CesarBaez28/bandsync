"use server";

import { auth, unstable_update } from "@/auth";
import { changePassword, ChangePasswordRequest, leaveMusicalBand, registerUser, registerUserFromInvitation, updateUser } from "../api/users";
import { ApiResponse, MusicalBand } from "../definitions";
import { editUserSchema } from "../schemas/editUserSchema";
import { formRegisterSchema } from "../schemas/formRegisterSchema";
import { handleAsync } from "../utils";
import { UUID } from "node:crypto";
import { changePasswordSchema } from "../schemas/changePasswordSchema";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { forgotPassword, ForgotPasswordRequest, resetPassword, ResetPasswordRequest } from "../api/auth";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";

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

  const token = formData.get("token") as string;

  let response: ApiResponse<MusicalBand> | null;
  let error: Error | null;

  if (token === '') {
    [response, error] = await handleAsync<ApiResponse<MusicalBand>>(registerUser(requestBody));
  } else {
    [response, error] = await handleAsync<ApiResponse<MusicalBand>>(registerUserFromInvitation({ ...requestBody, token }));
  }

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

export type UserInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string
  photo: string
}

export type UpdateUserState = {
  errors?: {
    name?: string[];
    lastName?: string[];
    phone?: string[];
  };
  user?: UserInfo
  message?: string | null;
  success: boolean;
}

export async function updateUserAction(prevState: UpdateUserState, formData: FormData): Promise<UpdateUserState> {

  const requestBody = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    photo: prevState.user?.photo
  };

  const validatedFields = editUserSchema.safeParse(requestBody);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const imageFile = formData.get('image') as File

  const body = new FormData()
  body.append(
    'user',
    new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
  )
  body.append('image', imageFile, imageFile.name)

  const [response, errors] = await handleAsync<ApiResponse<UserInfo>>(updateUser(body));

  if (errors) {
    console.error("Error updating user:", errors);
    return {
      message: "Ocurrió un error al editar los datos. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: "Ocurrió un error al guardar la información. Por favor, inténtelo de nuevo.",
      success: response?.success ?? false
    };
  }

  const session = await auth();
  await unstable_update({
    user: {
      ...session?.user,
      ...response.data
    }
  })

  return {
    success: true,
    user: response.data
  }
}

export type LeaveMusicalBandState = {
  message?: string | null;
  success: boolean;
}

export async function leaveMusicalBandAction(prevState: LeaveMusicalBandState, FormData: FormData): Promise<LeaveMusicalBandState> {
  const musicalBandId = FormData.get("musicalBandId") as UUID;
  const userId = FormData.get("userId") as UUID;

  const [response, errors] = await handleAsync<ApiResponse<void>>(leaveMusicalBand(userId, musicalBandId));

  if (errors) {
    console.error("Error leaving musical band:", errors);
    return {
      message: "Ocurrió un error al salir de la banda musical. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true
  }
}

export type ChangePasswordState = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmNewPassword?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function changePasswordAction(prevState: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const validateFields = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    }
  }

  const requestBody: ChangePasswordRequest = {
    oldPassword: validateFields.data.currentPassword,
    newPassword: validateFields.data.newPassword,
  }

  const [response, errors] = await handleAsync<ApiResponse<void>>(changePassword(requestBody));

  if (errors) {
    console.error("Error changing password:", errors);
    return {
      message: errors.message || "Ocurrió un error al cambiar la contraseña. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true
  }
}

export type ForgotPasswordState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function forgotPasswordAction(prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {

  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get("email")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const requestBody: ForgotPasswordRequest = {
    email: validatedFields.data.email,
  }

  const [response, errors] = await handleAsync<ApiResponse<void>>(forgotPassword(requestBody));

  if (errors) {
    console.error("Error processing forgot password request:", errors);
    return {
      message: errors.message || "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true
  }
}

export type ResetPasswordState = {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function resetPasswordAction(prev: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const validatedFields = resetPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    }
  }

  const token = formData.get("token") as string;

  console.log("Token recibido en resetPasswordAction:", token);

  const requestBody: ResetPasswordRequest = {
    token,
    newPassword: validatedFields.data.newPassword,
  }

  const [response, errors] = await handleAsync<ApiResponse<void>>(resetPassword(requestBody));

  if (errors) {
    console.error("Error resetting password:", errors);
    return {
      message: errors.message || "Ocurrió un error al restablecer la contraseña. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true
  }
}