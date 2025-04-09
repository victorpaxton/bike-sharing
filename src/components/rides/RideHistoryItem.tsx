import { reservationService, Reservation } from '../../lib/services/reservationService';
import { formatPrice } from '../../utils/pricing';
import { Navigation, Timer, DollarSign, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';

// Props interface remains the same
interface RideHistoryItemProps {
  ride: Reservation;
}

// Component definition remains the same
export const RideHistoryItem = ({ ride }: RideHistoryItemProps) => {
  const startTime = dayjs(ride.startTime);
  const endTime = ride.endTime ? dayjs(ride.endTime) : null;
  const duration = ride.durationMinutes;
  const distance = ride.distanceTraveled ? `${ride.distanceTraveled.toFixed(1)} km` : '-- km';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
        <div className="mb-2 sm:mb-0">
          <div className="flex items-center text-gray-800 font-medium">
            <span>{ride.startStation.name}</span>
            <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
            <span>{ride.endStation?.name || 'Unknown Return'}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <span>Started: {startTime.format('ddd, MMM D, h:mm A')}</span>
            {endTime && (
              <span className="ml-2">Ended: {endTime.format('h:mm A')}</span>
            )}
            <span className="mx-2">•</span>
            <span>Bike: {ride.bike.bikeNumber}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Navigation className="w-4 h-4 mr-1.5 text-blue-500" />
          <span>{distance}</span>
        </div>
        <div className="flex items-center">
          <Timer className="w-4 h-4 mr-1.5 text-green-500" />
          <span>{duration} min</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1.5 text-yellow-600" />
          <span>{formatPrice(ride.totalCost)}</span>
        </div>
      </div>
    </div>
  );
}; 