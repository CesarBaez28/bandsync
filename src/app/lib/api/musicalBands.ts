import { UUID } from "crypto";
import { config } from "../config";
import { MusicalBand } from "../definitions";

export async function getMusicalBandsByUser({ id }: { id: UUID }): Promise<MusicalBand[]> {
  const data = await fetch(`${config.api}/musical-bands/findByUserId/${id}`, {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJVc3VhcmlvUHJ1ZWJhIiwiaWF0IjoxNzQ2OTkzNzU4LCJleHAiOjE3NDcwMjk3NTh9.bCaiVxkLUXmUu4Ki_l6TKaYiJPAad2r1jVR81q2uQU03sy6OCf7EN8eCpfvdAhKj`,
    }
  });

  if (!data.ok) {
    throw new Error(`Error al obtener bandas: ${data.status}`);
  }

  const response = await data.json();
  return response.data;
}