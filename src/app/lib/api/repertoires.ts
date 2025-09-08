import { UUID } from "crypto";
import { ApiResponse, PagedData, Repertoire, Song } from "../definitions";
import { config } from "../config";
import { auth } from "@/auth";

type GetRepertoiresProps = {
  musicalBandId: UUID | undefined;
  query?: string;
  page?: number;
};

export async function getRepertoiresByMusicalBandId({ musicalBandId, query, page }: GetRepertoiresProps): Promise<ApiResponse<PagedData<Repertoire>>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/repertoires/find/${musicalBandId}?query=${query}&page=${page}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting repertoires by musical band id");
  }

  return await response.json();
}

export async function getRepertoireById({ repertoireId, musicalBandId }: { repertoireId: UUID | undefined; musicalBandId: UUID | undefined }): Promise<ApiResponse<Repertoire>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/repertoires/findById/${repertoireId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting repertoire by id");
  }

  return await response.json();
}

export async function getRepertoireSongs({ repertoireId, musicalBandId }: { repertoireId: UUID | undefined; musicalBandId: UUID | undefined }): Promise<ApiResponse<Song[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/repertoires/findRepertoireSongs/${repertoireId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting repertoire songs by repertoire id");
  }

  return await response.json();
}

export async function deleteRepertoireById({ repertoireId, musicalBandId }: { repertoireId: UUID | undefined; musicalBandId: UUID | undefined }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/repertoires/delete/${repertoireId}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    throw new Error("Error while deleting repertoire by id");
  }

  return await response.json();
}

type CreateRepertoireProps = {
  musicalBandId: UUID | undefined;
  name: string;
  link?: string;
  description?: string;
  songs: { id: string }[];
}

export async function createRepertoire({ musicalBandId, name, link, description, songs }: CreateRepertoireProps): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }
  
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const body = {
    musicalBand: musicalBandId,
    name,
    description,
    link,
    songs,
    status: true
  };

  const response = await fetch(`${config.api}/repertoires/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error("Error while creating repertoire");
  }

  return await response.json();
}

type UpdateRepertoireProps = {
  repertoireId: UUID | undefined;
  musicalBandId: UUID | undefined;
  name: string;
  link?: string;
  description?: string;
  songs: { id: string }[];
}

export async function updateRepertoire({ repertoireId, musicalBandId, name, link, description, songs }: UpdateRepertoireProps): Promise<ApiResponse<void>> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const body = {
    name,
    description,
    link,
    status: true,
    songs
  }

  const response = await fetch(`${config.api}/repertoires/updateRepertoire/${repertoireId}`, {
    method: 'PUT',
    headers,
    body:JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error("Error while updating repertoire");
  }

  return await response.json();
}