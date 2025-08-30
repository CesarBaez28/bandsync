'use server';

import { createSong, deleteSongById, updateSongById } from "../api/songs";
import { ApiResponse, Song } from "../definitions";
import { songSchema } from "../schemas/songSchema";
import { handleAsync } from "../utils";

export type SongState = {
  errors?: {
    name?: string[];
    tonality?: string[];
    link?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createSongAction(prevState: SongState, formData: FormData): Promise<SongState> {

  const validatedFields = songSchema.safeParse({
    name: formData.get("name"),
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

  const musicalBandId = formData.get("musicalBandId") as string;

  const [response, errors] = await handleAsync<ApiResponse<Song>>(createSong(body, musicalBandId));

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

export type UpdateSongState = {
  errors?: {
    name?: string[];
    tonality?: string[];
    link?: string[];
  };
  song?: Song
  message?: string | null;
  success: boolean;
}

export async function updateSongAction(prevState: UpdateSongState, formData: FormData): Promise<SongState> {

  const validatedFields = songSchema.safeParse({
    name: formData.get("name"),
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
    artist: { id: formData.get("artist") },
    genre: { id: formData.get("genre") },
    tonality: formData.get("tonality"),
    link: formData.get("link"),
    sheetMusic: prevState?.song?.sheetMusic,
    status: true
  };

  const imageFile = formData.get('image') as File

  const body = new FormData()
  body.append(
    'song',
    new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
  )
  body.append('file', imageFile, imageFile.name)

  const idValue = formData.get("id");
  const id = Number(idValue);

  const musicalBandId = formData.get("musicalBandId") as string;

  const [response, errors] = await handleAsync<ApiResponse<Song>>(updateSongById(body, id, musicalBandId));

  if (errors) {
    console.error("Error updating song:", errors);
    return {
      message: "Ocurrió un error al editar la canción. Por favor, inténtelo de nuevo más tarde.",
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

export type DeleteSongActionState = {
  success: boolean;
  message?: string | null;
}

export async function deleteSongAction(prevState: DeleteSongActionState, formData: FormData) {
  const idValue = formData.get("id");
  const id = Number(idValue);

  const musicalBandId = formData.get("musicalBandId") as string;

  const [response, errors] = await handleAsync<ApiResponse<void>>(deleteSongById({ id, musicalBandId }));

  if (errors) {
    console.error("Error deleting song:", errors);
    return {
      message: "Ocurrió un error al eliminar la canción. Por favor, inténtelo de nuevo más tarde.",
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