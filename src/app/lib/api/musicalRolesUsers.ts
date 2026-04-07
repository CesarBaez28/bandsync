import { UUID } from "node:crypto";
import { ApiResponse, MusicalRolesUsers } from "../definitions";
import { auth } from "@/auth";
import { config } from "../config";

const MUSICAL_ROLES_USERS_PATH = 'musical-roles-users';

export async function getAllByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<MusicalRolesUsers[]>> {
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

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_USERS_PATH}/findAllByMusicalBandId/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting musical roles by musical band id");
  }

  return await response.json();
}

type AssignRolesToUserProps = {
  userId: UUID;
  musicalBandId: UUID;
  roleIds: { id: string }[];
}

export async function assignRolesToUser({ userId, musicalBandId, roleIds }: AssignRolesToUserProps): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_USERS_PATH}/assignMusicalRoles/${musicalBandId}/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      [config.musicalBandHeader]: musicalBandId
    },
    body: JSON.stringify(roleIds)
  });

  return await response.json();
}