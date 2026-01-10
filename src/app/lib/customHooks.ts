import { usePermissionsStore } from "../store/usePermissionsStore";

export function usePermissions() {
  const {
    userRolesAndPermissions,
    setUserRolesAndPermissions,
    clearUserRolesAndPermissions,
    hasPermission,
    hasAnyPermission
  } = usePermissionsStore();

  return {
    userRolesAndPermissions,
    setUserRolesAndPermissions,
    clearUserRolesAndPermissions,
    hasPermission,
    hasAnyPermission
  };
}