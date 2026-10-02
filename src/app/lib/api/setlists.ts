'use server'

import { auth } from "@/auth";
import { config } from "../config";
import { ApiResponse, PagedData, Setlist, SetlistDetails } from "../definitions";
import { UUID } from "node:crypto";

const SETLISTS_PATH = 'setlists';

type SearchSetlistsByMusicalBandIdParams = {
  musicalBandId: string | undefined;
  query: string | undefined;
  page: number | undefined;
}

export async function searchSetlistsByMusicalBandId({ musicalBandId, query, page }: SearchSetlistsByMusicalBandIdParams): Promise<ApiResponse<PagedData<Setlist>>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/musicalBandId/${musicalBandId}/search?query=${query}&page=${page}`, {
    headers,
  });

  const result: ApiResponse<PagedData<Setlist>> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while getting setlists by musical band id");
  }

  return result;
}

export async function getSetListsByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<Setlist[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/musicalBandId/${musicalBandId}`, {
    headers,
  });

  const result: ApiResponse<Setlist[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while getting setlists by musical band id");
  }

  return result;
}

export async function downloadSetListSpreadsheet({ musicalBandId, setlistId }: { musicalBandId: UUID, setlistId: UUID }): Promise<Blob> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/${setlistId}/spreadsheet`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(errorResponse?.message || 'Error al descargar el archivo Excel del set list.');
  }

  return response.blob();
}


export type createSetListParams = {
  name: string;
  repertoire: {
    id: UUID;
  };
  musicalBand: {
    id: UUID;
  };
  description: string;
  sets: {
    name: string;
    orderIndex: number;
    songs: {
      id: string;
      orderIndex: number;
      notes?: string;
    }[];
  }[];
}

export async function createSetlist({ name, repertoire, description, musicalBand, sets }: createSetListParams): Promise<ApiResponse<Setlist>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };

  if (musicalBand) {
    headers[config.musicalBandHeader] = musicalBand.id;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/musicalBandId/${musicalBand.id}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, repertoire, description, musicalBand, sets }),
  });

  const result: ApiResponse<Setlist> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while creating setlist");
  }

  return result;
}

export async function getSetlistDetailsById({ setlistId, musicalBandId }: { setlistId: UUID; musicalBandId: UUID | undefined }): Promise<ApiResponse<SetlistDetails>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/${setlistId}`, { headers });
  const result: ApiResponse<SetlistDetails> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while getting setlist by id");
  }

  return result;
}

export type updateSetListParams = {
  setlistId: UUID;
  name: string;
  repertoire: {
    id: UUID;
  };
  musicalBand: {
    id: UUID;
  };
  description: string;
  sets: {
    id?: UUID;
    name: string;
    orderIndex: number;
    songs: {
      setSongId?: UUID
      songId: string;
      orderIndex: number;
      notes?: string;
    }[];
  }[];
}

export async function updateSetlist({ setlistId, name, repertoire, description, musicalBand, sets }: updateSetListParams): Promise<ApiResponse<Setlist>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };

  if (musicalBand) {
    headers[config.musicalBandHeader] = musicalBand.id;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/${setlistId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name, repertoire, description, musicalBand, sets }),
  });

  const result: ApiResponse<Setlist> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while updating setlist");
  }

  return result;
}

export async function deleteSetList({ musicalBandId, setlistId }: { musicalBandId: UUID, setlistId: UUID }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/${setlistId}`, {
    method: 'DELETE',
    headers
  });

  const result: ApiResponse<void> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while deleting setlist");
  }

  return result;
}