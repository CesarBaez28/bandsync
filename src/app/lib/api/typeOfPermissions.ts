import { UUID } from "node:crypto";
import { ApiResponse, TypeOfPermission } from "../definitions";
import { config } from "../config";
import { auth } from "@/auth";

const TYPE_OF_PERMISSIONS_PATH = "type-of-permissions";

export default async function getAllTypesOfPermissions({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<TypeOfPermission[]>> {
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

  const response = await fetch(`${config.api}/${TYPE_OF_PERMISSIONS_PATH}/findAll`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting all types of permissions");
  }

  return await response.json();
}