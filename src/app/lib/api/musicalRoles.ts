import { auth } from "@/auth";
import { config } from "../config";
import { ApiResponse, MusicalRole, PagedData } from "../definitions";
import { UUID } from "crypto";

const MUSICAL_ROLES_PATH = 'musical-roles';

type GetMusicalRolesByMusicalBandIdAndNameParams = {
  musicalBandId: string | undefined;
  query?: string;
  page?: number;
};

export async function getMusicalRolesByMusicalBandIdAndName({
  musicalBandId,
  query,
  page
}: GetMusicalRolesByMusicalBandIdAndNameParams): Promise<ApiResponse<PagedData<MusicalRole>>> {
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

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_PATH}/findByMusicalBandIdAndName/${musicalBandId}?query=${query}&page=${page}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting musical roles by musical band id");
  }

  return await response.json();
}

export type CreateMusicalRoleParams = {
  name: string;
  musicalBandId: UUID | undefined;
};

export async function createMusicalRole({ name, musicalBandId }: CreateMusicalRoleParams): Promise<ApiResponse<MusicalRole>> {
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

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_PATH}/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, musicalBandId })
  });

  if (!response.ok) {
    throw new Error("Error while creating musical role");
  }

  return await response.json();
}

export async function updateMusicalRole({ id, name, musicalBandId }: { id: number, name: string; musicalBandId: UUID | undefined }): Promise<ApiResponse<void>> {
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

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_PATH}/updateMusicalRoleName/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Error while updating musical role by id");
  }

  return await response.json();
}

export async function deleteMusicalRoleById({ id, musicalBandId }: { id: number; musicalBandId: UUID | undefined }): Promise<ApiResponse<void>> {
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

  const response = await fetch(`${config.api}/${MUSICAL_ROLES_PATH}/delete/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while deleting musical role by id");
  }    
  
  return await response.json();
}