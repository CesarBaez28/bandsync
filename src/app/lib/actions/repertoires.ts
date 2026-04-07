'use server';

import { UUID } from "crypto";
import { createRepertoire, deleteRepertoireById, getRepertoireSongs, updateRepertoire } from "../api/repertoires";
import { ApiResponse, Song } from "../definitions";
import { handleAsync } from "../utils";
import { repertoireSchema } from "../schemas/repertoireSchema";
import { exportSchema } from "../schemas/exportRepertoireSchema";

export type RepertoireState = {
  errors?: {
    name?: string[];
    description?: string[];
    link?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createRepertoireAction(prevState: RepertoireState, formData: FormData) {

  const validatedFields = repertoireSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    link: formData.get("link"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;

  const songs = (formData.get("songs") as string)
    ?.split(',')
    .filter(id => id) // Filtrar IDs vacíos
    .map(id => ({ id }));

  const requestBody = {
    musicalBandId,
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    link: validatedFields.data.link,
    songs,
    status: true
  };

  const [response, error] = await handleAsync<ApiResponse<void>>(createRepertoire(requestBody));

  if (error) {
    console.error("Error creating repertoire:", error);
    return {
      message: "Ocurrió un error al crear el repertorio. Por favor, inténtelo de nuevo.",
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

export async function updateRepertoireAction(prevState: RepertoireState, formData: FormData) {
  const validatedFields = repertoireSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    link: formData.get("link"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;
  const repertoireId = formData.get("repertoireId") as UUID | undefined;

  const songs = (formData.get("songs") as string)
    ?.split(',')
    .filter(id => id) // Filtrar IDs vacíos
    .map(id => ({ id }));

  const requestBody = {
    repertoireId,
    musicalBandId,
    name: validatedFields.data.name,
    link: validatedFields.data.link,
    description: validatedFields.data.description,
    songs
  };

  const [response, error] = await handleAsync<ApiResponse<void>>(updateRepertoire(requestBody));

  if (error) {
    console.error("Error updating repertoire:", error);
    return {
      message: "Ocurrió un error al actualizar el repertorio. Por favor, inténtelo de nuevo.",
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

export type DeleteRepertoireActionState = {
  success: boolean;
  message?: string | null;
};

export async function deleteRepertoireAction(prevState: DeleteRepertoireActionState, formData: FormData) {
  const repertoireId = formData.get("id") as UUID | undefined;
  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteRepertoireById({ repertoireId, musicalBandId }));

  if (error) {
    console.error("Error deleting repertoire:", error);
    return {
      message: "Ocurrió un error al eliminar la canción. Por favor, inténtelo de nuevo.",
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

export type ExportRepertoireState = {
  errors?: {
    repertoire?: string[];
    option?: string[];
  };
  message?: string | null;
  data?: {
    songs?: Song[],
    repertoire?: string,
    option?: string
  },
  success: boolean;
}

export async function exportRepertoireAction(prevState: ExportRepertoireState, formData: FormData) {
  const validatedFields = exportSchema.safeParse({
    repertoire: formData.get("repertoire"),
    option: formData.get("option"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;

  const requestBody = {
    repertoireId: validatedFields.data.repertoire as UUID,
    musicalBandId
  };

  const [response, error] = await handleAsync<ApiResponse<Song[]>>(getRepertoireSongs(requestBody));

  if (error) {
    console.error("Error gettings songs of repetoire:", error);
    return {
      message: "Ocurrió un error al obtener las canciones del repertorio. Por favor, inténtelo de nuevo.",
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
    data: {
      songs: response.data,
      repertoire: validatedFields.data.repertoire,
      option: validatedFields.data.option
    },
    success: response.success
  }
}