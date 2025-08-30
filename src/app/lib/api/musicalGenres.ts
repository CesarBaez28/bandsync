import { UUID } from "crypto";
import { ApiResponse, MusicalGenre, PagedData } from "../definitions";
import { auth } from "@/auth";
import { config } from "../config";

const MUSICAL_GENRES_PATH = 'musical-genres';

type GetMusicalGenresByMusicalBandIdAndNameProps = {
  musicalBandId: UUID | undefined;
  query?: string;
  page?: number;
}

export async function getMusicalGenresByMusicalBandIdAndName({
  musicalBandId,
  query,
  page }: GetMusicalGenresByMusicalBandIdAndNameProps): Promise<ApiResponse<PagedData<MusicalGenre>>> {

  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${MUSICAL_GENRES_PATH}/findByMusicalBandIdAndName/${musicalBandId}?query=${query}&page=${page}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting musical genres by musical band id and name");
  }

  return await response.json();
}

export async function getAllMusicalGenresByMusicalBandId({
  musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<MusicalGenre[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${MUSICAL_GENRES_PATH}/findByMusicalBandId/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting musical genres by musical band id and name");
  }

  return await response.json();
}

type CreateMusicalGenreParams = {
  name: string;
  musicalBandId: UUID | undefined
}

export async function createMusicalGenre({ name, musicalBandId }: CreateMusicalGenreParams): Promise<ApiResponse<MusicalGenre>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${MUSICAL_GENRES_PATH}/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, musicalBandId }),
  });

  return await response.json();
}

export async function updateMusicalGenreById({ name, id }: { name: string; id: number }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const response = await fetch(`${config.api}/${MUSICAL_GENRES_PATH}/updateMusicalGenreName/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ name })
  })

  return await response.json();
}

export async function deleteMusicalGenreById({ id }: { id: number }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const response = await fetch(`${config.api}/${MUSICAL_GENRES_PATH}/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  return await response.json();
}
