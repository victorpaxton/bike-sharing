import axios from 'axios';
import { LoginResponse } from '../types/auth'; // Corrected path, removed unused User

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize auth header from localStorage if token exists
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the latest token on each request
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      // Let the AuthContext handle the navigation
      return Promise.reject(new Error('Unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Registration Request Type
export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Assuming registration returns the same structure as login
export type RegisterResponse = LoginResponse;

// Define registration function separately
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  // Use the created api instance for the call
  const response = await api.post<RegisterResponse>('/auth/register', userData);
  return response.data;
};

// Export the api instance as default
export default api; 