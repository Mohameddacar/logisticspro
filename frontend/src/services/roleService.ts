import api from './api';
import { ApiResponse } from '@/types';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    permission: Permission;
  }[];
}

export interface Permission {
  id: string;
  name: string;
  key: string;
  module: string;
}

export const getAllRoles = async () => {
  const { data } = await api.get<ApiResponse<Role[]>>('/roles');
  return data.data;
};

export const getAllPermissions = async () => {
  const { data } = await api.get<ApiResponse<Permission[]>>('/roles/permissions');
  return data.data;
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]) => {
  const { data } = await api.post<ApiResponse<Role>>('/roles/permissions', { roleId, permissionIds });
  return data.data;
};
