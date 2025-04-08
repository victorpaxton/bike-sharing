export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    token: string;
    refreshToken: string;
    expiresIn: number;
    fullName: string;
    roles: string;
  };
  timestamp: string;
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  roles: string;
} 