import api from '../api';

export interface Station {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  availableStandardBikes: number;
  availableElectricBikes: number;
  capacity: number;
  status: boolean;
}

export interface StationsResponse {
  success: boolean;
  message: string;
  data: Station[];
  timestamp: string;
}

export const stationService = {
  getMapStations: async (): Promise<Station[]> => {
    const response = await api.get<StationsResponse>('/stations/map');
    return response.data.data;
  }
}; 