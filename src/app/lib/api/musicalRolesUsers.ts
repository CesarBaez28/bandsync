import { UUID } from "crypto";
import { ApiResponse, MusicalRolesUsers } from "../definitions";
import { auth } from "@/auth";
import { config } from "../config";

const MUSICAL_ROLES_USERS_PATH = 'musical-roles-users';

export async function getAllByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<MusicalRolesUsers[]>> {
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

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_USERS_PATH}/findAllByMusicalBandId/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting musical roles by musical band id");
  }

  return await response.json();
}