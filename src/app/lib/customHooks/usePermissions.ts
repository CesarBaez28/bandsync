import { usePermissionsStore } from "../../store/usePermissionsStore";

export function usePermissions() {
  const {
    userRolesAndPermissions,
    permissionsLoaded,
    setUserRolesAndPermissions,
    clearUserRolesAndPermissions,
    hasPermission,
    hasAnyPermission
  } = usePermissionsStore();

  return {
    userRolesAndPermissions,
    permissionsLoaded,
    setUserRolesAndPermissions,
    clearUserRolesAndPermissions,
    hasPermission,
    hasAnyPermission
  };
}