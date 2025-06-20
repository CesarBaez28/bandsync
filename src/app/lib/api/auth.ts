import { config } from "../config";
import { UserSesion } from "../definitions";

export async function signInWithApi ({username, password} : {username: string, password: string}) : Promise<UserSesion> {
  const response = await fetch(`${config.api}/users/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  
  const result = await response.json();
  return result.data;
}