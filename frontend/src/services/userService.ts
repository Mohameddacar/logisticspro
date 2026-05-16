import api from './api';
import { UserProfile, ApiResponse, PasswordUpdateData } from '@/types';

export const getProfile = async () => {
  const { data } = await api.get<ApiResponse<UserProfile>>('/users/profile');
  return data.data;
};

export const updateProfile = async (userData: Partial<UserProfile>) => {
  const { data } = await api.put<ApiResponse<UserProfile>>('/users/profile', userData);
  return data.data;
};

export const changePassword = async (passwordData: PasswordUpdateData) => {
  const { data } = await api.put<ApiResponse<void>>('/users/password', passwordData);
  return data.data;
};

export const getAllUsers = async () => {
  const { data } = await api.get<ApiResponse<UserProfile[]>>('/users');
  return data.data;
};

export const updateUserRole = async (userId: string, roleId: string) => {
  const { data } = await api.put<ApiResponse<UserProfile>>('/users/role', { userId, roleId });
  return data.data;
};

export const toggleUserStatus = async (userId: string, status: 'ACTIVE' | 'INACTIVE') => {
  const { data } = await api.put<ApiResponse<UserProfile>>('/users/status', { userId, status });
  return data.data;
};

export const deleteUser = async (userId: string) => {
  const { data } = await api.delete<ApiResponse<void>>(`/users/${userId}`);
  return data.data;
};
