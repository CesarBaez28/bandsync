import { UUID } from "node:crypto";
import { UserInfo } from "../actions/users";
import { config } from "../config";
import { ApiResponse, MusicalBand, PagedData, User } from "../definitions";
import { auth } from "@/auth";

const USER_PATH = 'users';

interface RegisterUserParams {
  username: string;
  email: string;
  password: string;
  repeatedPassword: string;
}

export async function registerUser({
  username,
  email,
  password,
  repeatedPassword,
}: RegisterUserParams): Promise<ApiResponse<MusicalBand>> {

  const response = await fetch(`${config.api}/${USER_PATH}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, repeatedPassword }),
  });

  return await response.json();
}

type RegisterUserFromInvitationParams = {
  username: string;
  email: string;
  password: string;
  repeatedPassword: string;
  token: string;
}

export async function registerUserFromInvitation({
  username,
  email,
  password,
  repeatedPassword,
  token
}: RegisterUserFromInvitationParams): Promise<ApiResponse<MusicalBand>> {

  const response = await fetch(`${config.api}/${USER_PATH}/register/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, repeatedPassword }),
  });

  return await response.json();
}

export async function getUserById(): Promise<ApiResponse<User>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.")
  }

  const response = await fetch(`${config.api}/users/findById/${session.user?.id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  if (!response.ok) {
    throw new Error("Error while geting musicalbands by user id");
  }

  const data = await response.json();
  return data;
}

export async function updateUser(formData: FormData): Promise<ApiResponse<UserInfo>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw Error("Unauthorized: No session or access token found.")
  }

  const response = await fetch(`${config.api}/${USER_PATH}/updateUser/${session.user?.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData
  });

  return await response.json();
}

type GetUsersByMusicalBandIdProps = {
  musicalBandId: UUID | undefined;
  query?: string;
  page?: number;
}

export async function getUsersByMusicalBandId({ musicalBandId, query, page }: GetUsersByMusicalBandIdProps): Promise<ApiResponse<PagedData<User>>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${USER_PATH}/find/${musicalBandId}?query=${query}&page=${page}`, {
    method: 'GET',
    headers
  });

  return await response.json();
}

export async function getAllUsersByMusicalBandId({ musicalBandId }: { musicalBandId: UUID | undefined }): Promise<ApiResponse<User[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  }

  if (musicalBandId) {
    headers[config.musicalBandHeader] = musicalBandId;
  }

  const response = await fetch(`${config.api}/${USER_PATH}/findAllByMusicalBandId/${musicalBandId}`, {
    method: 'GET',
    headers
  });

  return await response.json();
}

export async function leaveMusicalBand(userId: UUID, musicalBandId: UUID): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/leaveMusicalBand/${musicalBandId}/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      [config.musicalBandHeader]: musicalBandId
    }
  });

  return await response.json();
}