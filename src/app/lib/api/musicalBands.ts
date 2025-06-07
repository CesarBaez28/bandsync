import { config } from "../config";
import { MusicalBand } from "../definitions";
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
    throw new Error(`Error al obtener bandas: ${data.status}`);
  }

  const response = await data.json();
  return response.data;
}