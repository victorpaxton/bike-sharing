import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LoginRequest, LoginResponse } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import api from '../api';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, userId, email, fullName, roles } = data.data;
      login(token, {
        userId,
        email,
        fullName,
        roles,
      });
    },
  });
} 