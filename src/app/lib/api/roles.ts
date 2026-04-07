'use server';

import { UUID } from "node:crypto";
import { ApiResponse, RoleAndPermissions, User, UserRole, UserRolesAndPermissions } from "../definitions";
import { auth } from "@/auth";
import { config } from "../config";

const ROLES_PATH = "roles";

export type AssignRoleToUserParams = {
  musicalBandId: UUID;
  userId: UUID;
  roleId: number;
}

export async function assingRoleToUserInBand({ musicalBandId, userId, roleId }: AssignRoleToUserParams): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/assign/role/${roleId}/user/${userId}/musicalBand/${musicalBandId}`, {
    method: 'POST',
    headers
  });

  if (!response.ok) {
    throw new Error("Error while assigning role to user in band");
  }

  return await response.json();
}

export async function getRolesAndPermissionsByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<RoleAndPermissions[]>> {
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

  const response = await fetch(`${config.api}/${ROLES_PATH}/findByMusicalBandId/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting roles and permissions by musical band id");
  }

  return await response.json();
}

export async function getUserRolesAndPermissions({ userId }: { userId: UUID }): Promise<ApiResponse<UserRolesAndPermissions[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  const response = await fetch(`${config.api}/${ROLES_PATH}/user/${userId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Erro while getting roles and permissions of the user");
  }

  return await response.json();
}

export async function getUsersRoles({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<UserRole[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/users/musicalBand/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Erro while getting users roles");
  }

  return await response.json();
}

export type CreateRoleAndPermissionsParams = {
  musicalBand: { id: UUID };
  name: string;
  permissions: { id: string }[];
}

export async function createRole({ musicalBand, name, permissions }: CreateRoleAndPermissionsParams): Promise<ApiResponse<RoleAndPermissions>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json"
  };

  if (musicalBand.id) {
    headers[config.musicalBandHeader] = musicalBand.id;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/save`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      musicalBand,
      status: true,
      permissions
    })
  });

  if (!response.ok) {
    throw new Error("Error while creating role and permissions");
  }

  return await response.json();
}

export type UpdateRoleAndPermissionsParams = {
  musicalBandId: UUID;
  roleId: number;
  newName: string;
  permissions: { id: string }[];
}

export async function updateRoleAndPermissions({ musicalBandId, roleId, newName, permissions }: UpdateRoleAndPermissionsParams): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json"
  };

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/update`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      roleId,
      newName,
      permissions
    })
  });

  if (!response.ok) {
    throw new Error("Error while updating role and permissions");
  }

  return await response.json();
}

export type UpdateUserRoleProps = {
  musicalBandId: UUID;
  userId: UUID;
  role: { id: number }
}

export async function updateUserRole({ musicalBandId, userId, role }: UpdateUserRoleProps) {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json"
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/user/${userId}/musicalBand/${musicalBandId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(role)
  });

  if (!response.ok) {
    throw new Error("Error while updating user role");
  }

  return await response.json();
}

type DeleteRoleByIdProps = {
  musicalBandId: UUID;
  roleId: number
}

export async function deleteRoleById({ musicalBandId, roleId }: DeleteRoleByIdProps): Promise<ApiResponse<User[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json"
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/delete/${roleId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while deleting the role");
  }

  return await response.json();
}

export async function deleteUserRole({ musicalBandId, userId }: { musicalBandId: UUID; userId: UUID }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${ROLES_PATH}/delete/user/${userId}/musicalBand/${musicalBandId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while deleting user role");
  }

  return await response.json();
}