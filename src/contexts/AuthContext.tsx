import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  isAdmin: boolean;
}

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (formData: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual login API call with password
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        balance: 50.00,
        isAdmin: email.endsWith('@admin.com'), // Make users with @admin.com email admins
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate(mockUser.isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const register = async (formData: RegisterFormData) => {
    try {
      // TODO: Implement actual registration API call
      const mockUser = {
        id: '1',
        name: formData.name,
        email: formData.email,
        balance: 0.00,
        isAdmin: false,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 