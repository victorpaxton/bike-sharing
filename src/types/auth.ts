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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  balance: number;
  paymentMethod?: {
    cardNumber: string;
    expiryDate: string;
  };
} 