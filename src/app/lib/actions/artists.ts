"use server";

import { UUID } from "crypto";
import { createArtist } from "../api/artists";
import { ApiResponse, Artist } from "../definitions";
import { createArtistSchema } from "../schemas/CreateArtistSchema";
import { handleAsync } from "../utils";

export type CreateArtistState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createArtistAction(prevState: CreateArtistState, formData: FormData) {

  const validatedFields = createArtistSchema.safeParse({
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