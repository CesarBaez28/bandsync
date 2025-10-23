'use server';

import { auth } from "@/auth";
import { config } from "../config";
import { UUID } from "node:crypto";
import { ApiResponse, Event } from "../definitions";

const EVENT_PATH = "events";

export async function getAllEventsByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<Event[]>> {
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

  const response = await fetch(`${config.api}/${EVENT_PATH}/findByMusicalBandId/${musicalBandId}`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Error while getting events by musical band id");
  }

  return await response.json();
}

export type CreateEventRequestBody = {
  musicalBand: { id: UUID };
  repertoire: { id: UUID };
  name: string;
  date: string;
  description?: string;
  place?: string;
  location?: string;
  status: boolean;
};

export async function createEvent(requestBody: CreateEventRequestBody): Promise<ApiResponse<Event>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  }

  headers[config.musicalBandHeader] = requestBody.musicalBand.id;

  const response = await fetch(`${config.api}/${EVENT_PATH}/save`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Error while creating event");
  }

  return await response.json();
}

export type UpdateEventRequestBody = {
  repertoireId: UUID;
  date: string;
  name: string;
  description?: string;
  place: string;
  location: string;
  status: boolean;
}
export async function updateEvent({ id, musicalBandId, requestBody }: { id: UUID, musicalBandId: UUID, requestBody: UpdateEventRequestBody }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  }

  headers[config.musicalBandHeader] = musicalBandId;

  const response = await fetch(`${config.api}/${EVENT_PATH}/update/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Error while updating event");
  }

  return await response.json();
}

export async function deleteEvent({ id, musicalBandId }: { id: UUID, musicalBandId: UUID }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  headers[config.musicalBandHeader] = musicalBandId;

  const response = await fetch(`${config.api}/${EVENT_PATH}/delete/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Error while deleting event");
  }

  return await response.json();
}