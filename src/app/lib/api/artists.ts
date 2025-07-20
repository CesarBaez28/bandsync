import { auth } from "@/auth";
import { ApiResponse, Artist, PagedData } from "../definitions";
import { config } from "../config";
import { UUID } from "crypto";

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

  const response = await fetch(`${config.api}/artists/findByMusicalBandIdAndName/${musicalBandId}?query=${query}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  if (!response.ok) {
    throw new Error("Error while getting artists by musical band id");
  }

  return await response.json();
}

