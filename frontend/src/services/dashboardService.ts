import api from './api';
import { DashboardStats, ApiResponse } from '@/types';

export const getDashboardStats = async () => {
  const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  return data.data;
};
