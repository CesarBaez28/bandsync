'use server';

import { createSong } from "../api/songs";
import { ApiResponse, Song } from "../definitions";
import { createSongSchema } from "../schemas/createSongSchema";
import { handleAsync } from "../utils";

export type CreateSongState = {
  errors?: {
    name?: string[];
    tonality?: string[];
    link?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createSongAction(prevState: CreateSongState, formData: FormData): Promise<CreateSongState> {

  const validatedFields = createSongSchema.safeParse({
    name: formData.get("name"),
    musicalBand: formData.get("musicalBandId"),
    artist: formData.get("artist"),
    genre: formData.get("genre"),
    tonality: formData.get("tonality"),
    link: formData.get("link"),
    status: true
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const requestBody = {
    name: formData.get("name"),
    musicalBand: { id: formData.get("musicalBandId") },
    artist: { id: formData.get("artist") },
    genre: { id: formData.get("genre") },
    tonality: formData.get("tonality"),
    link: formData.get("link"),
    status: true
  };

  const imageFile = formData.get('image') as File

  const body = new FormData()
  body.append(
    'song',
    new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
  )
  body.append('file', imageFile, imageFile.name)

  const [response, errors] = await handleAsync<ApiResponse<Song>>(createSong(body));

  if (errors) {
    console.error("Error creating song:", errors);
    return {
      message: "Ocurrió un error al registrar la canción. Por favor, inténtelo de nuevo más tarde.",
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
    success: true,
  }
}