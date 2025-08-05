"use server";

import { UUID } from "crypto";
import deleteArtistById, { createArtist, updateArtistById } from "../api/artists";
import { ApiResponse, Artist } from "../definitions";
import { artistSchema } from "../schemas/artistSchema";
import { handleAsync } from "../utils";

export type ArtistActionState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createArtistAction(prevState: ArtistActionState, formData: FormData) {

  const validatedFields = artistSchema.safeParse({
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

  const [response, error] = await handleAsync<ApiResponse<Artist>>(createArtist(requestBody));

  if (error) {
    console.error("Error creating artist:", error);
    return {
      message: "Ocurrió un error al crear el artista. Por favor, inténtelo de nuevo.",
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

export async function updateArtistAction(prevState: ArtistActionState, formData: FormData) {
  const validatedFields = artistSchema.safeParse({
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

  const [response, error] = await handleAsync<ApiResponse<void>>(updateArtistById(requestBody));

  if (error) {
    console.error("Error updating artist:", error);
    return {
      message: "Ocurrió un error al actualizar el artista. Por favor, inténtelo de nuevo.",
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

export type DeleteArtistActionState = {
  success: boolean;
  message?: string | null;
};

export async function deleteArtistAction(prevState: DeleteArtistActionState, formData: FormData) {
  const idValue = formData.get("id");
  const id = Number(idValue);

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteArtistById({ id }));

  if (error) {
    console.error("Error deleting artist:", error);
    return {
      message: "Ocurrió un error al eliminar el artista. Por favor, inténtelo de nuevo.",
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