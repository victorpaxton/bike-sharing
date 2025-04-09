import api from '../api';

export interface Bike {
  id: string;
  bikeNumber: string;
  type: 'STANDARD' | 'ELECTRIC';
  batteryLevel: number | null;
  status: string;
  modelName: string | null;
  manufactureYear: number;
  lastMaintenanceDate: string | null;
  averageRating: number | null;
  totalRatings: number;
  currentStation: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    district: string;
    ward: string;
    imageUrl: string;
    availableStandardBikes: number;
    availableElectricBikes: number;
    capacity: number;
    status: boolean;
  };
}

interface BikesResponse {
  success: boolean;
  message: string;
  data: Bike[];
  timestamp: string;
}

interface CreateBikeRequest {
  bikeNumber: string;
  type: 'STANDARD' | 'ELECTRIC';
}

interface CreateBikeResponse {
  success: boolean;
  message: string;
  data: Bike;
  timestamp: string;
}

export const bikeService = {
  getBikes: async (): Promise<Bike[]> => {
    const response = await api.get<BikesResponse>('/bikes');
    return response.data.data;
  },

  createBike: async (stationId: string, data: CreateBikeRequest): Promise<Bike> => {
    const response = await api.post<CreateBikeResponse>(`/stations/${stationId}/bikes`, data);
    return response.data.data;
  },
}; 