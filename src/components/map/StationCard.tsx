import { Link } from 'react-router-dom';
import { MapPin, Clock, Bike, Zap, Navigation, ChevronRight } from 'lucide-react';
import { Station } from '../../types/station';

type StationCardProps = {
  station: Station;
  isSelected?: boolean;
  onSelect: (station: Station) => void;
};

const StationCard = ({ station, isSelected, onSelect }: StationCardProps) => {
  const handleClick = () => onSelect(station);

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-primary-300'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{station.name}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{station.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-4 h-4 mr-1" />
            <span>{station.distance}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3">
        <div className="flex items-center">
          <Bike className="w-4 h-4 text-primary-600 mr-1" />
          <span className="text-sm text-gray-600">{station.availableBikes} bikes</span>
        </div>
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-warning mr-1" />
          <span className="text-sm text-gray-600">{station.availableEBikes} e-bikes</span>
        </div>
        <button className="ml-auto p-2 text-gray-600 hover:text-gray-900">
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4">
        <Link
          to={`/reservation/${station.id}`}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <span className="mr-1">Reserve</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default StationCard; 