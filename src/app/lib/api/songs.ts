import { auth } from "@/auth";
import { ApiResponse, PagedData, Song } from "../definitions";
import { config } from "../config";
import { UUID } from "crypto";
import { MUSICAL_BAND_ID_HEADER } from "../constants";

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
    headers[MUSICAL_BAND_ID_HEADER] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${SONGS_PATH}/findByMusicalBandIdAndTerm/${musicalBandId}?query=${query}&page=${page}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while getting songs by musical band id and name");
  }

  return await response.json();
}

export async function createSong(formData: FormData): Promise<ApiResponse<Song>> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  const idValue = formData.get("musicalBandId");
  const musicalBandId = (typeof idValue === "string") ? idValue : undefined;

  if (musicalBandId) {
    headers[MUSICAL_BAND_ID_HEADER] = musicalBandId
  }

  const response = await fetch(`${config.api}/${SONGS_PATH}/save`, {
    method: 'POST',
    headers,
    body: formData
  });

  return await response.json();
}