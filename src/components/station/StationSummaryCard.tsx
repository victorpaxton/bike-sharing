import { Link } from 'react-router-dom';
import { Bike, Zap, ParkingCircle } from 'lucide-react';
import { Station } from '../../lib/services/stationService'; // Assuming Station type is here

interface StationSummaryCardProps {
  station: Station;
  distanceKm?: number; // Distance in kilometers, optional
}

export default function StationSummaryCard({ station, distanceKm }: StationSummaryCardProps) {
  const totalAvailableBikes = station.availableStandardBikes + station.availableElectricBikes;
  const availableDocks = station.capacity - totalAvailableBikes;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 flex-grow">
        <div className="flex items-start space-x-4 mb-3">
          <img
            src={station.imageUrl || '/placeholder-station.png'}
            alt={station.name}
            className="w-20 h-20 rounded-md object-cover border border-gray-200 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate mb-1">{station.name}</h3>
            <p className="text-sm text-gray-600 truncate mb-1">{station.address}</p>
            {typeof distanceKm === 'number' && (
               <p className="text-sm text-gray-500 mb-2">{distanceKm.toFixed(1)} km away</p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center" title="Available Standard Bikes">
                <Bike className="w-4 h-4 mr-1 text-gray-500" />
                <span>{station.availableStandardBikes}</span>
              </div>
              <div className="flex items-center" title="Available Electric Bikes">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{station.availableElectricBikes}</span>
              </div>
              <div className="flex items-center" title="Available Docks">
                <ParkingCircle className="w-4 h-4 mr-1 text-gray-500" />
                <span>{availableDocks}/{station.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Link
          to={`/reservation/${station.id}`}
          className="w-full block text-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Reserve a Bike
        </Link>
      </div>
    </div>
  );
} 