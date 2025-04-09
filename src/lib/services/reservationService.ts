import api from '../api';
import { Station, Bike } from './stationService'; // Import related types if needed

// Request Body Type
export interface CreateReservationRequest {
  bikeId: string;
  stationId: string;
  durationMinutes: number;
}

// Individual Reservation Data Type (from response data)
export interface Reservation {
  id: string;
  bike: Bike; // Reuse Bike type from stationService
  startStation: Station; // Reuse Station type from stationService
  endStation: Station | null;
  reservationTime: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  distanceTraveled: number | null;
  baseRate: number;
  timeCost: number;
  discount: number;
  totalCost: number;
  status: string; // Consider using specific statuses like 'ACTIVE', 'COMPLETED', etc.
}

// API Response Type
export interface CreateReservationResponse {
  success: boolean;
  message: string;
  data: Reservation; 
  timestamp: string;
}

// Type for the /reservations/active response
export interface ActiveReservationsResponse {
  success: boolean;
  message: string;
  data: Reservation[]; // API returns an array
  timestamp: string;
}

// Request Body Type for ending rental
export interface EndRentalRequest {
  returnStationId: string;
}

// API Response Type for ending rental (reuses Reservation for data)
export interface EndRentalResponse {
  success: boolean;
  message: string;
  data: Reservation; 
  timestamp: string;
}

// API Response Type for Ride History (reuses Reservation)
export interface RideHistoryResponse {
  success: boolean;
  message: string;
  data: Reservation[]; // API returns an array of past reservations
  timestamp: string;
}

export const reservationService = {
  createReservation: async (data: CreateReservationRequest): Promise<CreateReservationResponse> => {
    const response = await api.post<CreateReservationResponse>('/reservations', data);
    return response.data;
  },

  // Function to get the currently active reservation (if any)
  getActiveReservation: async (): Promise<Reservation | null> => {
    const response = await api.get<ActiveReservationsResponse>('/reservations/active');
    if (response.data.success && response.data.data.length > 0) {
      return response.data.data[0]; // Return the first active reservation
    } else {
      return null; // No active reservation found
    }
  },

  // Function to end a reservation
  endReservation: async (reservationId: string, data: EndRentalRequest): Promise<EndRentalResponse> => {
    const response = await api.post<EndRentalResponse>(
      `/reservations/${reservationId}/end`,
      data
    );
    return response.data;
  },

  // Function to get the user's ride history
  getRideHistory: async (): Promise<Reservation[]> => {
    const response = await api.get<RideHistoryResponse>('/reservations/history');
    // Assuming the actual history data is in response.data.data
    return response.data.data || []; 
  },
}; 