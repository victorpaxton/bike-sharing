export type BikeType = 'standard' | 'electric';

export interface Bike {
  id: string;
  type: BikeType;
  name: string;
  description: string;
  thumbnail: string;
  batteryPercentage?: number;
  condition: number;
  pricePerHour: number;
} 