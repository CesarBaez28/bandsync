'use server';

import { UUID } from "crypto";
import { createMusicalGenre, deleteMusicalGenreById, updateMusicalGenreById } from "../api/musicalGenres";
import { ApiResponse, MusicalGenre } from "../definitions";
import { musicalGenreSchema } from "../schemas/musicalGenteSchema";
import { handleAsync } from "../utils";

export type MusicalGenreActionState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createMusicalGenreAction(prevState: MusicalGenreActionState, formData: FormData) {
  const validatedFields = musicalGenreSchema.safeParse({
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

  const [response, error] = await handleAsync<ApiResponse<MusicalGenre>>(createMusicalGenre(requestBody));

  if (error) {
    console.error("Error creating musical genre:", error);
    return {
      message: "Ocurrió un error al crear el género musical. Por favor, inténtelo de nuevo.",
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

export async function updateMusicalGenreAction(prevState: MusicalGenreActionState, formData: FormData) {
  const validatedFields = musicalGenreSchema.safeParse({
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

  const [response, error] = await handleAsync<ApiResponse<void>>(updateMusicalGenreById(requestBody));

  if (error) {
    console.error("Error updating musical genre:", error);
    return {
      message: "Ocurrió un error al actualizar el género musical. Por favor, inténtelo de nuevo.",
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

export type DeleteMusicalGenreActionState = {
  success: boolean;
  message?: string | null;
}

export async function deleteMusicalGenreAction (prevState: DeleteMusicalGenreActionState, formData: FormData) {
  const idValue = formData.get("id");
  const id = Number(idValue);

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteMusicalGenreById({ id }));

  if (error) {
    console.error("Error deleting musical genre:", error);
    return {
      message: "Ocurrió un error al eliminar el género musical. Por favor, inténtelo de nuevo.",
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