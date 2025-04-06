import { useState, useEffect } from 'react';
import Map from '../../components/map/Map';
import { Bike, Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';

interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableBikes: number;
  availableEBikes: number;
  coordinates: { lat: number; lng: number };
  image: string;
}

// Mock data for stations
const mockStations: Station[] = [
  // District 1 stations
  {
    id: '1',
    name: 'Ben Thanh Metro Station',
    address: '1 Le Loi Street, District 1, Ho Chi Minh City',
    distance: '0.3 km',
    availableBikes: 8,
    availableEBikes: 5,
    coordinates: { lat: 10.7719, lng: 106.6982 },
    image: '/stations/ben-thanh.jpg',
  },
  {
    id: '2',
    name: 'Opera House Station',
    address: '7 Lam Son Square, District 1, Ho Chi Minh City',
    distance: '0.5 km',
    availableBikes: 6,
    availableEBikes: 4,
    coordinates: { lat: 10.7769, lng: 106.7032 },
    image: '/stations/opera-house.jpg',
  },
  {
    id: '3',
    name: 'Ba Son Metro Station',
    address: '2 Ton Duc Thang Street, District 1, Ho Chi Minh City',
    distance: '0.7 km',
    availableBikes: 7,
    availableEBikes: 3,
    coordinates: { lat: 10.7836, lng: 106.7047 },
    image: '/stations/ba-son.jpg',
  },
  {
    id: '4',
    name: 'Thu Thiem Metro Station',
    address: 'Thu Thiem New Urban Area, District 2, Ho Chi Minh City',
    distance: '1.2 km',
    availableBikes: 5,
    availableEBikes: 4,
    coordinates: { lat: 10.7872, lng: 106.7223 },
    image: '/stations/thu-thiem.jpg',
  },
  {
    id: '5',
    name: 'Saigon River Park Station',
    address: 'Ton Duc Thang Street, District 1, Ho Chi Minh City',
    distance: '0.9 km',
    availableBikes: 4,
    availableEBikes: 6,
    coordinates: { lat: 10.7823, lng: 106.7065 },
    image: '/stations/saigon-river.jpg',
  },
  {
    id: '6',
    name: 'Landmark 81 Station',
    address: '720A Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City',
    distance: '1.5 km',
    availableBikes: 9,
    availableEBikes: 7,
    coordinates: { lat: 10.7949, lng: 106.7219 },
    image: '/stations/landmark-81.jpg',
  },
  // Thu Duc City stations
  {
    id: '7',
    name: 'VNU-HCM Station',
    address: 'Linh Trung Ward, Thu Duc City, Ho Chi Minh City',
    distance: '2.1 km',
    availableBikes: 10,
    availableEBikes: 8,
    coordinates: { lat: 10.8700, lng: 106.8030 },
    image: '/stations/vnu-hcm.jpg',
  },
  {
    id: '8',
    name: 'Thu Duc Market Station',
    address: 'Thu Duc Market, Thu Duc City, Ho Chi Minh City',
    distance: '2.3 km',
    availableBikes: 6,
    availableEBikes: 4,
    coordinates: { lat: 10.8497, lng: 106.7539 },
    image: '/stations/thu-duc-market.jpg',
  },
  {
    id: '9',
    name: 'Thu Thiem 2 Bridge Station',
    address: 'Near Thu Thiem 2 Bridge, Thu Duc City, Ho Chi Minh City',
    distance: '2.5 km',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 10.7942, lng: 106.7501 },
    image: '/stations/thu-thiem-bridge.jpg',
  },
  {
    id: '10',
    name: 'High-Tech Park Station',
    address: 'Saigon High-Tech Park, Thu Duc City, Ho Chi Minh City',
    distance: '3.0 km',
    availableBikes: 12,
    availableEBikes: 10,
    coordinates: { lat: 10.8456, lng: 106.7944 },
    image: '/stations/high-tech-park.jpg',
  },
  {
    id: '11',
    name: 'Thu Duc Lake Park Station',
    address: 'Thu Duc Lake Park, Thu Duc City, Ho Chi Minh City',
    distance: '2.8 km',
    availableBikes: 7,
    availableEBikes: 5,
    coordinates: { lat: 10.8600, lng: 106.7800 },
    image: '/stations/thu-duc-lake.jpg',
  },
  // Stations near your location
  {
    id: '12',
    name: 'Linh Trung Station',
    address: 'Linh Trung Ward, Thu Duc City, Ho Chi Minh City',
    distance: '0.5 km',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 10.8200, lng: 106.7820 },
    image: '/stations/linh-trung.jpg',
  },
  {
    id: '13',
    name: 'Hi-Tech Park Gate 1',
    address: 'Entrance 1, Saigon High-Tech Park, Thu Duc City',
    distance: '0.8 km',
    availableBikes: 10,
    availableEBikes: 8,
    coordinates: { lat: 10.8250, lng: 106.7850 },
    image: '/stations/hitech-gate1.jpg',
  },
  {
    id: '14',
    name: 'Hi-Tech Park Gate 2',
    address: 'Entrance 2, Saigon High-Tech Park, Thu Duc City',
    distance: '1.0 km',
    availableBikes: 9,
    availableEBikes: 7,
    coordinates: { lat: 10.8300, lng: 106.7900 },
    image: '/stations/hitech-gate2.jpg',
  },
  {
    id: '15',
    name: 'Linh Trung Export Processing Zone',
    address: 'Linh Trung Export Processing Zone, Thu Duc City',
    distance: '1.2 km',
    availableBikes: 7,
    availableEBikes: 5,
    coordinates: { lat: 10.8350, lng: 106.7950 },
    image: '/stations/linh-trung-epz.jpg',
  },
  {
    id: '16',
    name: 'Thu Duc College Station',
    address: 'Thu Duc College, Thu Duc City, Ho Chi Minh City',
    distance: '1.5 km',
    availableBikes: 6,
    availableEBikes: 4,
    coordinates: { lat: 10.8400, lng: 106.8000 },
    image: '/stations/thu-duc-college.jpg',
  },
  {
    id: '17',
    name: 'Hi-Tech Park Research Center',
    address: 'Research Center, Saigon High-Tech Park, Thu Duc City',
    distance: '1.8 km',
    availableBikes: 11,
    availableEBikes: 9,
    coordinates: { lat: 10.8450, lng: 106.8050 },
    image: '/stations/hitech-research.jpg',
  },
  // Hanoi Highway stations
  {
    id: '18',
    name: 'Hanoi Highway Station 1',
    address: 'Near Thu Duc Intersection, Hanoi Highway, Thu Duc City',
    distance: '2.0 km',
    availableBikes: 9,
    availableEBikes: 7,
    coordinates: { lat: 10.8500, lng: 106.7600 },
    image: '/stations/hanoi-highway-1.jpg',
  },
  {
    id: '19',
    name: 'Hanoi Highway Station 2',
    address: 'Near VNU-HCM, Hanoi Highway, Thu Duc City',
    distance: '2.2 km',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 10.8550, lng: 106.7650 },
    image: '/stations/hanoi-highway-2.jpg',
  },
  {
    id: '20',
    name: 'Hanoi Highway Station 3',
    address: 'Near Hi-Tech Park, Hanoi Highway, Thu Duc City',
    distance: '2.5 km',
    availableBikes: 10,
    availableEBikes: 8,
    coordinates: { lat: 10.8600, lng: 106.7700 },
    image: '/stations/hanoi-highway-3.jpg',
  },
  {
    id: '21',
    name: 'Hanoi Highway Station 4',
    address: 'Near Thu Duc College, Hanoi Highway, Thu Duc City',
    distance: '2.8 km',
    availableBikes: 7,
    availableEBikes: 5,
    coordinates: { lat: 10.8650, lng: 106.7750 },
    image: '/stations/hanoi-highway-4.jpg',
  },
  {
    id: '22',
    name: 'Hanoi Highway Station 5',
    address: 'Near Linh Trung EPZ, Hanoi Highway, Thu Duc City',
    distance: '3.0 km',
    availableBikes: 11,
    availableEBikes: 9,
    coordinates: { lat: 10.8700, lng: 106.7800 },
    image: '/stations/hanoi-highway-5.jpg',
  }
];

export default function MapPage() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStations, setShowStations] = useState(true);
  const [distanceFilter, setDistanceFilter] = useState<number>(500); // Default to 500m
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, []);

  // Function to calculate distance between two coordinates in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Filter and sort stations based on distance from user
  const filteredStations = mockStations
    .filter((station) => {
      // Filter by search query
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by distance if user location is available
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.coordinates.lat,
          station.coordinates.lng
        );
        return matchesSearch && distance <= distanceFilter;
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      if (!userLocation) return 0;
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distanceA - distanceB;
    });

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    if (mapRef) {
      // Zoom to the selected station
      mapRef.setView([station.coordinates.lat, station.coordinates.lng], 18);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Distance Filter */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Distance</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={distanceFilter === 500}
                onChange={() => setDistanceFilter(500)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Within 500m</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={distanceFilter === 1000}
                onChange={() => setDistanceFilter(1000)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Within 1km</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={distanceFilter === 2000}
                onChange={() => setDistanceFilter(2000)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Within 2km</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={distanceFilter === 5000}
                onChange={() => setDistanceFilter(5000)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Within 5km</span>
            </label>
          </div>
        </div>

        {/* Nearby Stations Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowStations(!showStations)}
            >
              <span className="font-medium">Nearby Stations ({filteredStations.length})</span>
              {showStations ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {showStations && (
            <div className="p-4 space-y-4">
              {filteredStations.map((station) => (
                <div
                key={station.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedStation?.id === station.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => handleStationSelect(station)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={station.image}
                        alt={station.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.address}</p>
                      <p className="text-sm text-gray-500 mt-1">{station.distance}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Bike className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{station.availableBikes}</span>
                        </div>
                        <div className="flex items-center">
                          <Bike className="w-4 h-4 text-primary-500 mr-1" />
                          <span className="text-sm text-gray-600">{station.availableEBikes}</span>
                        </div>
                      </div>
          </div>
        </div>
      </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1">
        <Map 
          selectedStation={selectedStation} 
          onMapRef={setMapRef}
        />
      </div>
    </div>
  );
} 