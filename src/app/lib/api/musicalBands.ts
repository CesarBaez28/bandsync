import { UUID } from "crypto";
import { config } from "../config";
import { ApiResponse, MusicalBand, MusicalBandInfo } from "../definitions";
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

export async function getMusicalBandById({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<MusicalBand>> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const data = await fetch(`${config.api}/musical-bands/findById/${musicalBandId}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  if (!data.ok) {
    throw new Error("Error while geting musicalbands by id");
  }

  return await data.json();
}

export async function getMusicalBandByHyphenatedName({ name }: { name: string }): Promise<ApiResponse<MusicalBand>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const data = await fetch(`${config.api}/musical-bands/findByHyphenatedName/${name}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  if (!data.ok) {
    throw new Error("Error while geting musicalbands by id");
  }

  return await data.json()
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

export type InvitationProps = {
  email: string;
  user: { id: UUID };
  musicalBandId: UUID;
}

export async function sendInvitationEmail({ email, user, musicalBandId }: InvitationProps): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json'
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/musical-bands/${musicalBandId}/invite`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, invitedBy: user })
  });

  return await response.json();
}

export async function updateMusicalBand(musicalBandId: UUID, formData: FormData): Promise<ApiResponse<MusicalBandInfo>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  headers[config.musicalBandHeader] = musicalBandId;

  const response = await fetch(`${config.api}/musical-bands/update/${musicalBandId}`, {
    method: 'PUT',
    headers,
    body: formData
  });

  return await response.json();
}