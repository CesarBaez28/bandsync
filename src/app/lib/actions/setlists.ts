'use server';

import { UUID } from "node:crypto";
import { createSetlist, createSetListParams, deleteSetList, getSetlistDetailsById, updateSetlist, updateSetListParams } from "../api/setlists";
import { ApiResponse, Setlist, SetlistDetails } from "../definitions";
import { createSetListSchema } from "../schemas/createSetListSchema";
import { handleAsync } from "../utils";
import { exportSetListSchema } from "../schemas/exportSetListSchema";

export type SetListState = {
  errors?: {
    name?: string[];
    repertoire?: string[];
    description?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createSetListAction(prevState: SetListState, formData: FormData) {

  const validatedFields = createSetListSchema.safeParse({
    name: formData.get("name"),
    repertoire: formData.get("repertoire"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;
  const sets = formData.get('sets');
  const requestBody: createSetListParams = {
    name: validatedFields.data.name,
    repertoire: { id: validatedFields.data.repertoire as UUID },
    description: validatedFields.data.description,
    musicalBand: { id: musicalBandId as UUID },
    sets: sets ? JSON.parse(sets as string) : []
  };

  const [response, error] = await handleAsync<ApiResponse>(createSetlist(requestBody));

  if (error) {
    return {
      message: "Error al crear el SetList. Por favor, inténtelo de nuevo más tarde.",
      success: false
    };
  }

  if (!response.success) {
    return {
      message: response.message || "Error al crear el SetList.",
      success: false
    };
  }

  return {
    success: true
  }
}

export async function updateSetListAction(prevState: SetListState, formData: FormData) {
  const validatedFields = createSetListSchema.safeParse({
    name: formData.get("name"),
    repertoire: formData.get("repertoire"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const setlistId = formData.get("setlistId") as UUID;
  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;
  const sets = formData.get('sets');
  const requestBody: updateSetListParams = {
    setlistId,
    name: validatedFields.data.name,
    repertoire: { id: validatedFields.data.repertoire as UUID },
    description: validatedFields.data.description,
    musicalBand: { id: musicalBandId as UUID },
    sets: sets ? JSON.parse(sets as string) : []
  };

  console.log("requestBody", requestBody);

  const [response, error] = await handleAsync<ApiResponse<Setlist>>(updateSetlist(requestBody));

  if (error || !response.success) {
    return {
      message: response?.message || "Error al actualizar el SetList. Por favor, inténtelo de nuevo más tarde.",
      success: false
    };
  }

  return { success: true };
}

export type DeleteSetListState = {
  message?: string | null;
  success: boolean;
}

export async function deleteSetListAction(prevState: DeleteSetListState, formData: FormData) {
  const setlistId = formData.get("setlistId") as UUID;
  const musicalBandId = formData.get("musicalBandId") as UUID;

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteSetList({ musicalBandId, setlistId }));

  if (error || !response.success) {
    return {
      message: response?.message || "Error al eliminar el SetList. Por favor, inténtelo de nuevo más tarde.",
      success: false
    };
  }

  return { success: true };
}

export type ExportSetListState = {
  errors?: {
    setlist?: string[];
    option?: string[];
  };
  message?: string | null;
  data?: {
    setlistDetails?: SetlistDetails;
    option?: string;
  };
  success: boolean;
}

export async function exportSetListAction(prevState: ExportSetListState, formData: FormData) {
  const validatedFields = exportSetListSchema.safeParse({
    setlist: formData.get("setlist"),
    option: formData.get("option"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false,
    };
  }

  const musicalBandId = formData.get("musicalBandId") as UUID | undefined;

  const [response, error] = await handleAsync<ApiResponse<SetlistDetails>>(
    getSetlistDetailsById({
      setlistId: validatedFields.data.setlist as UUID,
      musicalBandId,
    })
  );

  if (error || !response?.success || !response.data) {
    return {
      message: response?.message || "Ocurrió un error al obtener el set list. Por favor, inténtelo de nuevo más tarde.",
      success: false,
    };
  }

  return {
    data: {
      setlistDetails: response.data,
      option: validatedFields.data.option,
    },
    success: true,
  };
}