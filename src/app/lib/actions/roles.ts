'use server';

import { UUID } from "node:crypto";
import { roleSchema } from "../schemas/roleSchema";
import { ApiResponse, RoleAndPermissions, User } from "../definitions";
import { handleAsync } from "../utils";
import { AssignRoleToUserParams, assingRoleToUserInBand, createRole, CreateRoleAndPermissionsParams, deleteRoleById, updateRoleAndPermissions, UpdateRoleAndPermissionsParams, updateUserRole, UpdateUserRoleProps } from "../api/roles";
import { userRoleSchema } from "../schemas/userRoleSchema";
import { assingRoleToUserSchema } from "../schemas/assingRoleToUserSchema";

export type RoleState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function createRoleAction(prevState: RoleState, formData: FormData) {
  const validatedFields = roleSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const musicalBandId = formData.get("musicalBandId") as UUID;
  const musicalBand = { id: musicalBandId }
  const permissions = (formData.get("permissions") as string)
    ?.split(',')
    .filter(Boolean) // Filtrar IDs vacíos
    .map(id => ({ id }))

  const requestBody: CreateRoleAndPermissionsParams = {
    musicalBand,
    name: validatedFields.data.name,
    permissions
  };

  const [response, error] = await handleAsync<ApiResponse<RoleAndPermissions>>(createRole(requestBody));

  if (error) {
    console.error("Error creating role:", error);
    return {
      message: "Ocurrió un error al crear el rol. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: true
  };
}

export type UserRoleState = {
  errors?: {
    role?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function updateUserRoleAction(prevState: UserRoleState, formData: FormData) {
  const validatedFields = userRoleSchema.safeParse({
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const roleValue = formData.get("role");
  const roleId = Number(roleValue);
  const musicalBandId = formData.get("musicalBandId") as UUID;
  const userId = formData.get("userId") as UUID;

  const requestBody: UpdateUserRoleProps = {
    musicalBandId,
    userId,
    role: { id: roleId }
  }

  const [response, error] = await handleAsync<ApiResponse<void>>(updateUserRole(requestBody));

  if (error) {
    console.error("Error updating user role:", error);
    return {
      message: "Ocurrió un error al actualizar el rol del usuario. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: true
  };
}

export async function updateRoleAction(prevState: RoleState, formData: FormData) {
  const validatedFields = roleSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const idValue = formData.get("roleId");
  const roleId = Number(idValue);
  const musicalBandId = formData.get("musicalBandId") as UUID;
  const permissions = (formData.get("permissions") as string)
    ?.split(',')
    .filter(Boolean) // Filtrar IDs vacíos
    .map(id => ({ id }))

  const requestBody: UpdateRoleAndPermissionsParams = {
    musicalBandId,
    roleId,
    newName: validatedFields.data.name,
    permissions
  };

  const [response, error] = await handleAsync<ApiResponse<void>>(updateRoleAndPermissions(requestBody));

  if (error) {
    console.error("Error updating role:", error);
    return {
      message: "Ocurrió un error al actualizar el rol. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: true
  };
}

export type RoleStateDelete = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
  data: User[] | undefined;
  success: boolean;
}

export async function deleteRoleAction(prevState: RoleStateDelete, formData: FormData) {

  const idValue = formData.get("roleId");
  const roleId = Number(idValue);
  const musicalBandId = formData.get("musicalBandId") as UUID;

  const [response, error] = await handleAsync<ApiResponse<User[]>>(deleteRoleById({ roleId, musicalBandId }));

  if (error) {
    console.error("Error deleting role:", error);
    return {
      message: "Ocurrió un error al eliminar el rol. Por favor, inténtelo de nuevo.",
      data: [],
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: "No se pudo eliminar porque hay usuarios con ese role.",
      data: response.data,
      success: false
    };
  }

  return {
    data: [],
    success: true
  };
}

export type RoleStateAssign = {
  errors?: {
    user?: string[];
    role?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function assignRoleToUserAction(prevState: RoleStateAssign, formData: FormData) {
  const validatedFields = assingRoleToUserSchema.safeParse({
    user: formData.get("user"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const roleId = Number(validatedFields.data.role);
  const userId = validatedFields.data.user as UUID;
  const musicalBandId = formData.get("musicalBandId") as UUID;

  const requestBody: AssignRoleToUserParams = {
    musicalBandId,
    userId,
    roleId
  }

  const [response, error] = await handleAsync<ApiResponse<void>>(assingRoleToUserInBand(requestBody));

  if (error) {
    console.error("Error assigning role to user:", error);
    return {
      message: "Ocurrió un error al asignar el rol al usuario. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  return {
    success: true
  };
}