import { create } from 'zustand';
import { UserRolesAndPermissions } from '../lib/definitions';
import { UUID } from 'node:crypto';

type UserRolesPermissionsState = {
  userRolesAndPermissions: UserRolesAndPermissions[];
  permissionsIndex: Set<string>;
  permissionsLoaded: boolean;

  setUserRolesAndPermissions: (permissions: UserRolesAndPermissions[]) => void;
  clearUserRolesAndPermissions: () => void;

  hasPermission: (permissionName: string, musicalBandId: UUID | undefined) => boolean;
  hasAnyPermission: (permissionNames: string[], musicalBandId: UUID | undefined) => boolean;
};

export const usePermissionsStore = create<UserRolesPermissionsState>((set, get) => ({
  userRolesAndPermissions: [],
  permissionsIndex: new Set<string>(),
  permissionsLoaded: false,

  setUserRolesAndPermissions: (permissions) => {
    const index = new Set<string>();

    permissions.forEach((urp) => {
      urp.permissions.forEach((perm) => {
        if (perm.status) {
          index.add(`${urp.musicalBand.id}-${perm.name}`);
        }
      });
    });

    set({
      userRolesAndPermissions: permissions,
      permissionsIndex: index,
      permissionsLoaded: true
    });
  },

  clearUserRolesAndPermissions: () =>
    set({
      userRolesAndPermissions: [],
      permissionsIndex: new Set(),
      permissionsLoaded: true
    }),

  hasPermission: (permissionName, musicalBandId) => {
    if (!musicalBandId) return false;
    return get().permissionsIndex.has(`${musicalBandId}-${permissionName}`);
  },

  hasAnyPermission: (permissionNames, musicalBandId) => {
    if (!musicalBandId) return false;
    const index = get().permissionsIndex;
    return permissionNames.some((name) => index.has(`${musicalBandId}-${name}`));
  }
}));
