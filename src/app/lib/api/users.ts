import { config } from "../config";
import { ApiResponse } from "../definitions";

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
}: RegisterUserParams): Promise<ApiResponse> {

  if (password !== repeatedPassword) {
    throw new Error("Passwords do not match");
  }

  try {
    const response = await fetch(`${config.api}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, repeatedPassword }),
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
