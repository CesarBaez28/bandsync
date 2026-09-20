'use server';

import { UUID } from "node:crypto";
import { createSetlist, createSetListParams } from "../api/setlists";
import { ApiResponse } from "../definitions";
import { createSetListSchema } from "../schemas/createSetListSchema";
import { handleAsync } from "../utils";

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

  console.log("Sets:", sets);

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