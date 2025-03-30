import { BikeType } from './bike';

export interface RecentRide {
  id: string;
  startStation: string;
  endStation: string;
  duration: string;
  distance: string;
  cost: number;
  date: string;
  bikeType: BikeType;
} 