import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RegisterRequest, RegisterResponse, registerUser } from '../api'; // Import function and types
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toaster'; // Assuming toast path is correct here

export function useRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerUser, // Use the imported registerUser function
    onSuccess: (data) => {
      // Assuming successful registration also logs the user in (returns token etc.)
      if (data.success && data.data.token) {
        const { token, userId, email, fullName, roles } = data.data;
        login(token, { userId, email, fullName, roles });
        toast('success', 'Registration successful! Welcome.');
        navigate('/dashboard', { replace: true }); // Redirect to dashboard
      } else {
        // Handle cases where registration succeeded but didn't return expected login data
        toast('error', data.message || 'Registration completed, but login failed. Please try logging in.');
        navigate('/login');
      }
    },
    onError: (error) => {
      // Handle API call errors (e.g., email already exists)
      console.error("Registration error:", error);
      // The error message from the backend might be useful here
      toast('error', `${error.response?.data?.message || 'Please check your details and try again.'}`);
    },
  });
} 