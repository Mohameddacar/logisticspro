import api from './api';
import { Transaction, ApiResponse } from '@/types';

export const getIncomes = async (filters: { categoryId?: string; startDate?: string; endDate?: string; search?: string } = {}) => {
  const { data } = await api.get<ApiResponse<Transaction[]>>('/incomes', { params: filters });
  return data.data;
};

export const createIncome = async (incomeData: Partial<Transaction>) => {
  const { data } = await api.post<ApiResponse<Transaction>>('/incomes', incomeData);
  return data.data;
};

export const updateIncome = async (id: string, incomeData: Partial<Transaction>) => {
  const { data } = await api.put<ApiResponse<Transaction>>(`/incomes/${id}`, incomeData);
  return data.data;
};

export const deleteIncome = async (id: string) => {
  const { data } = await api.delete<ApiResponse<void>>(`/incomes/${id}`);
  return data.data;
};
