export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableBikes: number;
  availableEBikes: number;
  coordinates: Coordinates;
  image?: string;
} 