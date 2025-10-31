import { create } from 'zustand';
import { UserRolesAndPermissions } from '../lib/definitions';

type UserRolesPermissionsState = {
  userRolesAndPermissions: UserRolesAndPermissions[];
  setUserRolesAndPermissions: (permissions: UserRolesAndPermissions[]) => void;
  clearUserRolesAndPermissions: () => void;
};

export const usePermissionsStore = create<UserRolesPermissionsState>((set) => ({
  userRolesAndPermissions: [],
  setUserRolesAndPermissions: (permissions) => set({ userRolesAndPermissions: permissions }),
  clearUserRolesAndPermissions: () => set({ userRolesAndPermissions: [] }),
}));
