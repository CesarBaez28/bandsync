import { config } from "../config";
import { ApiResponse, MusicalBand } from "../definitions";
import { auth } from "@/auth";

export async function getMusicalBandsByUser(): Promise<MusicalBand[]> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const data = await fetch(`${config.api}/musical-bands/findByUserId/${session.user?.id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  if (!data.ok) {
    throw new Error("Error while geting musicalbands by user id");
  }

  const response = await data.json();
  return response.data;
}

export async function saveMusicalBand(formData: FormData): Promise<ApiResponse<MusicalBand>> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/musical-bands/save`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData
  });

  return await response.json();
}