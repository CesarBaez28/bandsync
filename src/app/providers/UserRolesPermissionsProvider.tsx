'use client';

import { useEffect } from "react";
import { usePermissionsStore } from "../store/usePermissionsStore";
import { handleAsync } from "../lib/utils";
import { ApiResponse, UserRolesAndPermissions } from "../lib/definitions";
import { getUserRolesAndPermissions } from "../lib/api/roles";
import { Session } from "next-auth";

export default function PermissionsProvider({ session, children }: { readonly session: Session | null, readonly children: React.ReactNode }) {
  const { setUserRolesAndPermissions, clearUserRolesAndPermissions } = usePermissionsStore();

  useEffect(() => {
    async function loadPermissions() {
      if (session?.accessToken) {
        const [response, error] = await handleAsync<ApiResponse<UserRolesAndPermissions[]>>(
          getUserRolesAndPermissions({ userId: session.user.id })
        );

        if (error || !response?.data) {
          console.log('Error loading roles and permissions: ', error);
          clearUserRolesAndPermissions();
          return;
        }

        setUserRolesAndPermissions(response.data);
        return;
      }

      clearUserRolesAndPermissions();
    }

    loadPermissions();
  }, [session, setUserRolesAndPermissions, clearUserRolesAndPermissions]);


  return <>{children}</>;
}
