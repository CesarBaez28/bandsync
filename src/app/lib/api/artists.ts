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

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/findByMusicalBandIdAndName/${musicalBandId}?query=${query}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
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

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ name, musicalBandId }),
  });

  return await response.json();
}

export async function updateArtistById({ name, id }: { name: string; id: number }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const response = await fetch(`${config.api}/${ARTISTS_PATH}/updateArtistName/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ name })
  })

  return await response.json();
}
