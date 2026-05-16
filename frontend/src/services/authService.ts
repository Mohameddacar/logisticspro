import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '@/types';

export const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return data.data;
};

export const register = async (userData: RegisterData) => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
  return data.data;
};

export const logout = async () => {
  const { data } = await api.post<ApiResponse<void>>('/auth/logout');
  return data.data;
};
