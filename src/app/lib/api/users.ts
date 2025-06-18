import { config } from "../config";
import { ApiResponse, MusicalBand } from "../definitions";

interface RegisterUserParams {
  username: string;
  email: string;
  password: string;
  repeatedPassword: string;
}

export default async function registerUser({
  username,
  email,
  password,
  repeatedPassword,
}: RegisterUserParams): Promise<ApiResponse<MusicalBand>> {

  const response = await fetch(`${config.api}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, repeatedPassword }),
  });

  return await response.json();
}
