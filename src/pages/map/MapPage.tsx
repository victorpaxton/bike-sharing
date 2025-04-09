import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Map from '../../components/map/Map';
import { Bike, Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';
import { stationService, Station } from '../../lib/services/stationService';
import { useNavigate } from 'react-router-dom';

export default function MapPage() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStations, setShowStations] = useState(true);
  const [distanceFilter, setDistanceFilter] = useState<number>(500); // Default to 500m
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'bikes' | 'docks'>('all');
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  // Fetch stations data
  const { data: stations = [], isLoading, error } = useQuery({
    queryKey: ['stations'],
    queryFn: stationService.getMapStations,
  });

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
  const filteredStations = stations
    .filter((station) => {
      // Filter by search query
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by availability
      const totalAvailableBikes = station.availableStandardBikes + station.availableElectricBikes;
      const availableDocks = station.capacity - totalAvailableBikes;
      const matchesAvailability = 
        availabilityFilter === 'all' ||
        (availabilityFilter === 'bikes' && totalAvailableBikes > 0) ||
        (availabilityFilter === 'docks' && availableDocks > 0);

      // Filter by distance if user location is available
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.latitude,
          station.longitude
        );
        return matchesSearch && matchesAvailability && (distanceFilter === -1 || distance <= distanceFilter);
      }

      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      if (!userLocation) return 0;
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.latitude,
        a.longitude
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.latitude,
        b.longitude
      );
      return distanceA - distanceB;
    });

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    if (mapRef) {
      mapRef.setView([station.latitude, station.longitude], 18);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Stations</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

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
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={distanceFilter === -1}
                onChange={() => setDistanceFilter(-1)}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">All stations</span>
            </label>
          </div>
        </div>

        {/* Availability Filter */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === 'all'}
                onChange={() => setAvailabilityFilter('all')}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Show all stations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === 'bikes'}
                onChange={() => setAvailabilityFilter('bikes')}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Has available bikes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === 'docks'}
                onChange={() => setAvailabilityFilter('docks')}
                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Has available docks</span>
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
              <span className="font-medium">
                {isLoading ? 'Loading Stations...' : `Nearby Stations (${filteredStations.length})`}
              </span>
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
                        src={station.imageUrl}
                        alt={station.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.address}</p>
                      {userLocation && (
                        <p className="text-sm text-gray-500 mt-1">
                          {(calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            station.latitude,
                            station.longitude
                          ) / 1000).toFixed(1)} km away
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Bike className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{station.availableStandardBikes}</span>
                        </div>
                        <div className="flex items-center">
                          <Bike className="w-4 h-4 text-primary-500 mr-1" />
                          <span className="text-sm text-gray-600">{station.availableElectricBikes}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-1">Docks:</span>
                          <span className="text-sm text-gray-600">
                            {station.availableStandardBikes + station.availableElectricBikes}/{station.capacity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/reservation/${station.id}`);
                        }}
                        className="mt-2 w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors"
                      >
                        Reserve a Bike
                      </button>
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
          stations={stations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 