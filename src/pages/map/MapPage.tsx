import { useState } from 'react';
import { Bike, ChevronUp, ChevronDown } from 'lucide-react';
import MapSearch from '../../components/map/MapSearch';
import StationCard from '../../components/map/StationCard';
import { Station } from '../../types/station';

type FilterState = {
  standard: boolean;
  electric: boolean;
};

const mockStations: Station[] = [
  {
    id: '1',
    name: 'Central Park South',
    address: '123 Park Avenue, New York, NY',
    distance: '0.2 mi',
    availableBikes: 12,
    availableEBikes: 3,
    coordinates: { lat: 40.7829, lng: -73.9654 },
    image: '/stations/central-park.jpg',
  },
  {
    id: '2',
    name: '5th Avenue',
    address: '456 5th Avenue, New York, NY',
    distance: '0.5 mi',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 40.7580, lng: -73.9855 },
    image: '/stations/5th-avenue.jpg',
  },
  {
    id: '3',
    name: 'Times Square',
    address: '789 Broadway, New York, NY',
    distance: '0.8 mi',
    availableBikes: 5,
    availableEBikes: 2,
    coordinates: { lat: 40.7580, lng: -73.9855 },
    image: '/stations/times-square.jpg',
  },
];

const MapPage = () => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    standard: true,
    electric: true,
  });

  const handleStationSelect = (station: Station) => setSelectedStation(station);
  const handlePanelToggle = () => setIsPanelOpen(!isPanelOpen);
  const handleFilterChange = (type: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [type]: e.target.checked }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Left Panel - Search and Stations */}
      <div className="absolute top-20 left-4 z-10 bg-white rounded-lg shadow-sm w-80">
        {/* Search Section */}
        <div className="p-4 border-b border-gray-100">
          <MapSearch value={searchQuery} onChange={setSearchQuery} />
          <div className="space-y-2 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.standard}
                onChange={handleFilterChange('standard')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Standard Bikes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.electric}
                onChange={handleFilterChange('electric')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Electric Bikes</span>
            </label>
          </div>
        </div>

        {/* Stations Section */}
        <div>
          <div
            className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-100"
            onClick={handlePanelToggle}
          >
            <h2 className="text-lg font-semibold text-gray-900">Nearby Stations</h2>
            {isPanelOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            )}
          </div>

          <div className={`p-4 space-y-4 max-h-[60vh] overflow-y-auto transition-all duration-300 ${
            isPanelOpen ? 'block' : 'hidden'
          }`}>
            {mockStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isSelected={selectedStation?.id === station.id}
                onSelect={handleStationSelect}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-100">
          {/* Map will be implemented later */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Bike className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Map Component Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage; 