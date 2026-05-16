import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, // 30s timeout
});

// Request Interceptor: Logging & Auth
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Logging, Error Handling & Retries
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle Session Expiration
    if (error.response?.status === 401) {
      console.warn('[API 401] Unauthorized - Redirecting to login');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    // Network Errors & Retries
    if (!error.response && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('[API Network Error] Retrying request...', error.message);
      try {
        return await api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    // Structured Error Logging
    console.error(`[API Error] ${error.response?.status || 'Network'} ${error.config?.url}:`, 
      error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default api;
