import api from '../api';

export interface Station {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  ward: string;
  availableStandardBikes: number;
  availableElectricBikes: number;
  capacity: number;
  status: boolean;
  bikes: Bike[];
}

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

export interface StationsResponse {
  success: boolean;
  message: string;
  data: Station[];
  timestamp: string;
}

export interface StationResponse {
  success: boolean;
  message: string;
  data: Station;
  timestamp: string;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  ward: string;
  base64Image: string;
  capacity: number;
}

export const stationService = {
  getMapStations: async (): Promise<Station[]> => {
    const response = await api.get<StationsResponse>('/stations/map');
    return response.data.data;
  },

  getStationById: async (stationId: string): Promise<Station> => {
    const response = await api.get<StationResponse>(`/stations/${stationId}`);
    return response.data.data;
  },

  getNearbyStations: async (
    latitude: number,
    longitude: number,
    radius: number // in meters
  ): Promise<Station[]> => {
    const response = await api.get<StationsResponse>('/stations', {
      params: {
        latitude,
        longitude,
        radius,
        page: 0,
        size: 20, // Or adjust as needed
      },
    });
    return response.data.data; // Assuming the response structure matches StationsResponse
  },

  createStation: async (data: CreateStationRequest): Promise<Station> => {
    const response = await api.post<StationResponse>('/stations', data);
    return response.data.data;
  },
}; 