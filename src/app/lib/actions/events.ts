import { UUID } from "node:crypto";
import { eventSchema } from "../schemas/eventSchema";
import { handleAsync } from "../utils";
import { ApiResponse, Event } from "../definitions";
import { createEvent, CreateEventRequestBody, deleteEvent, updateEvent, UpdateEventRequestBody } from "../api/events";

export type EventState = {
  errors?: {
    name?: string[];
    repertoire?: string[];
    date?: string[];
    description?: string[];
    place?: string[];
    location?: string[];
  };
  newEvent?: Event
  message?: string | null;
  success: boolean;
}

export async function createEventAction(prevState: EventState, formData: FormData) {

  const validatedFields = eventSchema.safeParse({
    repertoire: formData.get("repertoire"),
    name: formData.get("name"),
    date: formData.get("date"),
    description: formData.get("description"),
    place: formData.get("place"),
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const requestBody: CreateEventRequestBody = {
    musicalBand: { id: formData.get("musicalBandId") as UUID },
    repertoire: { id: validatedFields.data.repertoire as UUID },
    name: validatedFields.data.name,
    date: validatedFields.data.date + "T00:00:00",
    description: validatedFields.data.description,
    place: validatedFields.data.place,
    location: validatedFields.data.location,
    status: true
  };

  const [response, error] = await handleAsync<ApiResponse<Event>>(createEvent(requestBody));

  if (error) {
    console.error("Error creating event:", error);
    return {
      message: "Ocurrió un error al crear el evento. Por favor, inténtelo de nuevo.",
      success: false
    };
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: false
    };
  }

  console.log("Event created successfully:", response.data);

  return {
    success: response.success,
    newEvent: response.data
  };
}

export async function updateEventAction(prevState: EventState, formData: FormData) {

  const validatedFields = eventSchema.safeParse({
    repertoire: formData.get("repertoire"),
    name: formData.get("name"),
    date: formData.get("date"),
    description: formData.get("description"),
    place: formData.get("place"),
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const requestBody: UpdateEventRequestBody = {
    repertoireId: validatedFields.data.repertoire as UUID,
    name: validatedFields.data.name,
    date: validatedFields.data.date + "T00:00:00",
    description: validatedFields.data.description,
    place: validatedFields.data.place,
    location: validatedFields.data.location,
    status: true
  };

  const eventId = formData.get("eventId") as UUID;
  const musicalBandId = formData.get("musicalBandId") as UUID;

  const [response, error] = await handleAsync<ApiResponse<void>>(updateEvent({ id: eventId, musicalBandId, requestBody }));

  if (error) {
    console.error("Error updating event:", error);
    return {
      message: "Ocurrió un error al actualizar el evento. Por favor, inténtelo de nuevo.",
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
    success: response.success
  };
} 

export type DeleteEventProps = {
  id: string;
  musicalBandId: UUID;
}

export async function deleteEventAction(prevState: EventState, deleteData: DeleteEventProps) {

  const request = {
    id: deleteData.id as UUID,
    musicalBandId: deleteData.musicalBandId
  }

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteEvent(request));

  if (error) {
    console.error("Error deleting event:", error);
    return {
      message: "Ocurrió un error al eliminar el evento. Por favor, inténtelo de nuevo.",
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
    success: response.success
  };
}