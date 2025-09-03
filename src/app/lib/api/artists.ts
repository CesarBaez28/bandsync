import { auth } from "@/auth";
import { ApiResponse, Artist, PagedData } from "../definitions";
import { config } from "../config";
import { UUID } from "crypto";

const ARTISTS_PATH = 'artists';

type GetArtistsByMusicalBandIdAndNameParams = {
  musicalBandId: UUID | undefined;
  query?: string;
  page?: number;
};

export async function getArtistsByMusicalBandIdAndName({
  musicalBandId,
  query,
  page
}: GetArtistsByMusicalBandIdAndNameParams): Promise<ApiResponse<PagedData<Artist>>> {
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

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/findByMusicalBandIdAndName/${musicalBandId}?query=${query}&page=${page}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting artists by musical band id");
  }

  return await response.json();
}

export async function getAllArtistsByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<Artist[]>> {
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

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/findByMusicalBandId/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting artists by musical band id");
  }

  return await response.json();
}

export type CreateArtistParams = {
  name: string;
  musicalBandId: UUID | undefined;
};

export async function createArtist({ name, musicalBandId }: CreateArtistParams): Promise<ApiResponse<Artist>> {
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

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, musicalBandId }),
  });

  return await response.json();
}

export async function updateArtistById({ name, id, musicalBandId }: { name: string; id: number; musicalBandId: UUID | undefined }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }
  const response = await fetch(`${config.api}/${ARTISTS_PATH}/updateArtistName/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name })
  })

  return await response.json();
}

export default async function deleteArtistById({ id, musicalBandId }: { id: number; musicalBandId: UUID | undefined }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/delete/${id}`, {
    method: 'DELETE',
    headers,
  })

  return await response.json();
}
