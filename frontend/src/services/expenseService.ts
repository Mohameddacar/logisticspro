import api from './api';
import { Transaction, ApiResponse } from '@/types';

export const getExpenses = async (filters: { categoryId?: string; startDate?: string; endDate?: string; search?: string } = {}) => {
  const { data } = await api.get<ApiResponse<Transaction[]>>('/expenses', { params: filters });
  return data.data;
};

export const createExpense = async (expenseData: Partial<Transaction>) => {
  const { data } = await api.post<ApiResponse<Transaction>>('/expenses', expenseData);
  return data.data;
};

export const updateExpense = async (id: string, expenseData: Partial<Transaction>) => {
  const { data } = await api.put<ApiResponse<Transaction>>(`/expenses/${id}`, expenseData);
  return data.data;
};

export const deleteExpense = async (id: string) => {
  const { data } = await api.delete<ApiResponse<void>>(`/expenses/${id}`);
  return data.data;
};
