import { UUID } from "node:crypto";
import { UserInfo } from "../actions/users";
import { config } from "../config";
import { ApiResponse, MusicalBandDeletionCheck, PagedData, User } from "@/app/lib/definitions";
import { auth } from "@/auth";
import { TransferSelection } from "@/app/ui/delete-account/DeleteAccountContent";

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
}: RegisterUserParams): Promise<ApiResponse<void>> {

  const response = await fetch(`${config.api}/${USER_PATH}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, repeatedPassword }),
  });

  const result: ApiResponse<void> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while registering a new user")
  }

  return result;
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
}: RegisterUserFromInvitationParams): Promise<ApiResponse<void>> {

  const response = await fetch(`${config.api}/${USER_PATH}/register/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, repeatedPassword }),
  });

  const result: ApiResponse<void> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error while registering a new user");
  }

  return result;
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

  const result: ApiResponse<UserInfo> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error updating user");
  }

  return result;
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

  const result: ApiResponse<PagedData<User>> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Error getting users");
  }

  return result;
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

  const result: ApiResponse<User[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Error getting users by musical band id')
  }

  return result;
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

  const result: ApiResponse<void> = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Error leaving musical band');
  }

  return result;
}

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
}

export async function changePassword({ oldPassword, newPassword }: ChangePasswordRequest): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const username = session.user?.username;

  const response = await fetch(`${config.api}/${USER_PATH}/change-password`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, oldPassword, newPassword })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error changing password");
  }

  return await response.json();
}

export type SetUp2FA = {
  qrUrl: string;
  secret: string;
}

export async function setUp2FA(): Promise<ApiResponse<SetUp2FA>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/auth/2fa/setup`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error setting up 2FA");
  }

  return await response.json();
}

export async function verify2FA(code: string | undefined, secret: string | undefined): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/auth/2fa/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ secret, code })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error verifying 2FA");
  }

  return await response.json();
}

export async function disable2FA(): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/auth/2fa/disable`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error disabling 2FA");
  }

  return await response.json();
}

export async function isNeedToAssignAdminRoleBeforeDeletion({ userId }: { userId: UUID }): Promise<ApiResponse<boolean>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/is-need-to-assign-admin-role-before-deletion/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}

export async function deleteAccount(): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/delete/${session.user.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}

export async function transferAndDeleteAccount({ transfer }: { transfer: TransferSelection[]; }): Promise<ApiResponse<void>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${config.api}/${USER_PATH}/transfer-admins-and-delete/${session.user.id}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(transfer)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}

export async function getBandBeforeDeleteAccount(): Promise<ApiResponse<MusicalBandDeletionCheck[]>> {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: No session or access token found.");
  }

  const response = await fetch(`${config.api}/${USER_PATH}/get-bands-before-deletion/${session.user.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}