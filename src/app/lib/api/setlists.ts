'use server'

import { auth } from "@/auth";
import { config } from "../config";
import { ApiResponse, PagedData, Setlist } from "../definitions";
import { UUID } from "node:crypto";

const SETLISTS_PATH = 'setlists';

type GetSetlistsByMusicalBandIdParams = {
  musicalBandId: string | undefined;
  query: string | undefined;
  page: number | undefined;
}

export async function getSetlistsByMusicalBandId({ musicalBandId, query, page }: GetSetlistsByMusicalBandIdParams): Promise<ApiResponse<PagedData<Setlist>>> {
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

  const response = await fetch(`${config.api}/${SETLISTS_PATH}/musicalBandId/${musicalBandId}?query=${query}&page=${page}`, {
    headers,
  });

  const result: ApiResponse<PagedData<Setlist>> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while getting setlists by musical band id");
  }

  return result;
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