'use server';

import { UUID } from "crypto";
import { musicalRoleSchema } from "../schemas/musicalRolesSchema";
import { ApiResponse, MusicalRole } from "../definitions";
import { createMusicalRole, deleteMusicalRoleById, updateMusicalRole } from "../api/musicalRoles";
import { handleAsync } from "../utils";

export type MusicalRoleActionState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createMusicalRoleAction(prevState: MusicalRoleActionState, formData: FormData) {

  const validatedFields = musicalRoleSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const requestBody = {
    name: validatedFields.data.name,
    musicalBandId: formData.get("musicalBandId") as UUID | undefined,
  };

  const [response, error] = await handleAsync<ApiResponse<MusicalRole>>(createMusicalRole(requestBody));

  if (error) {
    console.error("Error creating musical role:", error);
    return {
      message: "Ocurrió un error al crear el role musical. Por favor, inténtelo de nuevo.",
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
    success: response.success
  }
}

export async function updateMusicalRoleAction(prevState: MusicalRoleActionState, formData: FormData) {
  const validatedFields = musicalRoleSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const idValue = formData.get("id");
  const id = Number(idValue);

  const requestBody = {
    name: validatedFields.data.name,
    id,
  };

  const [response, error] = await handleAsync<ApiResponse<void>>(updateMusicalRole(requestBody));

  if (error) {
    console.error("Error updating musical role:", error);
    return {
      message: "Ocurrió un error al actualizar el role musical. Por favor, inténtelo de nuevo.",
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
    success: response.success
  }
}

export type DeleteMusicalRoleActionState = {
  success: boolean;
  message?: string | null;
};

export async function deleteMusicalRoleAction(prevState: DeleteMusicalRoleActionState, formData: FormData) {
  const idValue = formData.get("id");
  const id = Number(idValue);

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteMusicalRoleById({ id }));

  if (error) {
    console.error("Error deleting musical role:", error);
    return {
      message: "Ocurrió un error al eliminar el role musical. Por favor, inténtelo de nuevo.",
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
    success: response.success
  }
}