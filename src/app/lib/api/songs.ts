import { auth } from "@/auth";
import { ApiResponse, PagedData, Song } from "../definitions";
import { config } from "../config";
import { UUID } from "crypto";

const SONGS_PATH = 'songs';

type SearchSongsProps = {
  musicalBandId: UUID | undefined;
  query?: string;
  page?: number;
}

export async function getSongsByMusicalBandIdAndSearchTerm({ musicalBandId, query, page }: SearchSongsProps): Promise<ApiResponse<PagedData<Song>>> {
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

  const response = await fetch(`${config.api}/${SONGS_PATH}/findByMusicalBandIdAndTerm/${musicalBandId}?query=${query}&page=${page}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while getting songs by musical band id and name");
  }

  return await response.json();
}

export async function getAllSongsByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<Song[]>> {
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

  const response = await fetch(`${config.api}/${SONGS_PATH}/findByMusicalBandId/${musicalBandId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while getting all songs by musical band id");
  }

  return await response.json();
}

export async function getById({ id, musicalBandId }: { id: number, musicalBandId: UUID | undefined }): Promise<ApiResponse<Song>> {
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

  const response = await fetch(`${config.api}/${SONGS_PATH}/findById/${id}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while getting song by id");
  }

  return await response.json();
}

export async function createSong(formData: FormData, musicalBandId: string): Promise<ApiResponse<Song>> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  headers[config.musicalBandHeader] = musicalBandId

  const response = await fetch(`${config.api}/${SONGS_PATH}/save`, {
    method: 'POST',
    headers,
    body: formData
  });

  return await response.json();
}

export async function updateSongById(formData: FormData, id: number, musicalBandId: string): Promise<ApiResponse<Song>> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  headers[config.musicalBandHeader] = musicalBandId

  const response = await fetch(`${config.api}/${SONGS_PATH}/update/${id}`, {
    method: 'PUT',
    headers,
    body: formData
  });

  return await response.json();
}

export async function deleteSongById({ id, musicalBandId }: { id: number, musicalBandId: string }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  headers[config.musicalBandHeader] = musicalBandId;

  const response = await fetch(`${config.api}/${SONGS_PATH}/delete/${id}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    throw new Error("Error while deleting song by id: " + id);
  }

  return await response.json();
}