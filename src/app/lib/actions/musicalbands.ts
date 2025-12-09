'use server';
import { auth } from "@/auth";
import { deleteMusicalBand, InvitationProps, saveMusicalBand, sendInvitationEmail, updateMusicalBand } from "../api/musicalBands";
import { ApiResponse, MusicalBand, MusicalBandInfo } from "../definitions";
import { createMusicalBandSchema } from "../schemas/createMusicalBandSchema";
import { handleAsync } from "../utils";
import { UUID } from "crypto";
import { sendInvitationSchema } from "../schemas/sendInvitationSchema";

export type CreateMusicalBandState = {
  errors?: {
    name?: string[];
    address?: string[];
    phone?: string[];
    email?: string[];
  };
  data?: MusicalBand | null
  message?: string | null;
  success: boolean;
}

export async function createMusicalBandAction(prevState: CreateMusicalBandState, formData: FormData): Promise<CreateMusicalBandState> {
  const session = await auth()

  const requestBody = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    user: { id: session?.user.id },
    status: true
  };

  const validatedFields = createMusicalBandSchema.safeParse(requestBody);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const imageFile = formData.get('image') as File

  const body = new FormData()
  body.append(
    'musicalBand',
    new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
  )
  body.append('image', imageFile, imageFile.name)

  const [response, errors] = await handleAsync<ApiResponse<MusicalBand>>(saveMusicalBand(body));

  if (errors) {
    console.error("Error registering musical band:", errors);
    return {
      message: "Ocurrió un error al registrar la banda musical. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true,
    data: response.data
  }
}


export type UpdateMusicalBandState = {
  errors?: {
    name?: string[];
    address?: string[];
    phone?: string[];
    email?: string[];
  };
  band?: MusicalBandInfo
  message?: string | null;
  success: boolean;
}

export async function updateMusicalBandAction(prevState: UpdateMusicalBandState, formData: FormData) {
  const musicalBandId = formData.get("musicalBandId") as UUID;
  const logo = formData.get("logo") as string;

  const requestBody = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    logo
  };

  const validatedFields = createMusicalBandSchema.safeParse(requestBody);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const imageFile = formData.get('image') as File

  const body = new FormData()
  body.append(
    'musicalBand',
    new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
  )
  body.append('image', imageFile, imageFile.name)


  const [response, errors] = await handleAsync<ApiResponse<MusicalBandInfo>>(updateMusicalBand(musicalBandId, body));

  if (errors) {
    console.error("Error registering musical band:", errors);
    return {
      message: "Ocurrió un error al registrar la banda musical. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true,
    band: response.data
  }
}


export type InvitationState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
  success: boolean;
}

export async function sendInvitationEmailAction(prevState: InvitationState, formData: FormData) {
  const musicalBandId = formData.get("musicalBandId") as UUID;
  const userId = formData.get("userId") as UUID;
  const email = formData.get("email") as string;

  const validatedFields = sendInvitationSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario.",
      success: false
    };
  }

  const request: InvitationProps = {
    email,
    user: { id: userId },
    musicalBandId
  };

  const [response, errors] = await handleAsync<ApiResponse<void>>(sendInvitationEmail(request));

  if (errors) {
    console.error("Error sending invitation email:", errors);
    return {
      message: "Ocurrió un error al enviar la invitación. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true,
  }
}

export type DeleteMusicalBandActionState = {
  message?: string | null;
  success: boolean;
}

export async function deleteMusicalBandAction(prevState: DeleteMusicalBandActionState, formData: FormData) {
  const musicalBandId = formData.get("musicalBandId") as UUID;

  const [response, error] = await handleAsync<ApiResponse<void>>(deleteMusicalBand({ musicalBandId }));

  if (error) {
    console.error("Error deleting musical band:", error);
    return {
      message: "Ocurrió un error eliminar la banda. Por favor, inténtelo de nuevo más tarde.",
      success: false
    }
  }

  if (!response?.success) {
    return {
      message: response?.message,
      success: response?.success ?? false
    };
  }

  return {
    success: true,
  }
}