import { auth } from "@/auth";
import { ApiResponse, Permission } from "../definitions";
import { config } from "../config";
import { UUID } from "node:crypto";

const PERMISSIONS_PATH = "permissions";

export default async function getAllPermissions({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<Permission[]>> {
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

  const response = await fetch(`${config.api}/${PERMISSIONS_PATH}/findAll`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting all permissions");
  }

  return await response.json();
} 