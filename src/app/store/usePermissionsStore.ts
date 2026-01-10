import { create } from 'zustand';
import { UserRolesAndPermissions } from '../lib/definitions';
import { UUID } from 'node:crypto';

type UserRolesPermissionsState = {
  userRolesAndPermissions: UserRolesAndPermissions[];
  permissionsIndex: Set<string>;
  setUserRolesAndPermissions: (permissions: UserRolesAndPermissions[]) => void;
  clearUserRolesAndPermissions: () => void;
  hasPermission: (permissionName: string, musicalBandId: UUID) => boolean;
  hasAnyPermission: (permissionNames: string[], musicalBandId: UUID) => boolean;
};

export const usePermissionsStore = create<UserRolesPermissionsState>((set, get) => ({
  userRolesAndPermissions: [],
  permissionsIndex: new Set<string>(),

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
      permissionsIndex: index
    });
  },

  clearUserRolesAndPermissions: () => set({ userRolesAndPermissions: [] }),

  hasPermission: (permissionName, musicalBandId) => {
    return get().permissionsIndex.has(`${musicalBandId}-${permissionName}`);
  },

  hasAnyPermission: (permissionNames, musicalBandId) => {
    const index = get().permissionsIndex;
    return permissionNames.some((name) => index.has(`${musicalBandId}-${name}`));
  }
}));
