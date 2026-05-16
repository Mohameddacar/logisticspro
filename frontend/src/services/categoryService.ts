import api from './api';
import { Category, ApiResponse } from '@/types';

export const getIncomeCategories = async () => {
  const { data } = await api.get<ApiResponse<Category[]>>('/categories/income');
  return data.data;
};

export const getExpenseCategories = async () => {
  const { data } = await api.get<ApiResponse<Category[]>>('/categories/expense');
  return data.data;
};
