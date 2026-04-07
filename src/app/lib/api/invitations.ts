'use server';

import { config } from "../config";
import { AcceptInvitation, ApiResponse } from "../definitions";

const INVITATION_PATH = 'invitations'
const UNAUTHORIZED_STATUS = 401;

export default async function acceptInvitation({ token }: { token: string | undefined }): Promise<ApiResponse<AcceptInvitation>> {

  const response = await fetch(`${config.api}/${INVITATION_PATH}/accept/${token}`, {
    method: 'POST'
  });

  if (response.status === UNAUTHORIZED_STATUS) {
    throw new Error("Error while accepting invitation because the token is invalid or expired.");
  }

  return await response.json();
}