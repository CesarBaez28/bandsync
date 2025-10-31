"use server";

import { auth, unstable_update } from "@/auth";
import { registerUser, updateUser } from "../api/users";
import { ApiResponse, MusicalBand } from "../definitions";
import { editUserSchema } from "../schemas/editUserSchema";
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
