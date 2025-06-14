import { config } from "../config";
import { ApiResponse, MusicalBand } from "../definitions";
import { auth } from "@/auth";

export async function getMusicalBandsByUser(): Promise<MusicalBand[]> {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new Error("Unauthorized: No session or access token found.");
    }

    const data = await fetch(`${config.api}/musical-bands/findByUserId/${session.user?.id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      }
    });

    const response = await data.json();
    return response.data;
  } catch (error) {
    console.log(error)
    //TODO: SOLVE THIS
    return [];
  }
}

export async function saveMusicalBand(formData: FormData): Promise<ApiResponse> {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      console.error("Register User Error:", error.message);
      throw new Error(`User registration failed: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during user registration.");
    }
  }
}