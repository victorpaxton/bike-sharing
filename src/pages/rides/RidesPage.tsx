import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationService, Reservation } from '../../lib/services/reservationService';
import { Loader2, AlertCircle, Bike } from 'lucide-react';
import dayjs from 'dayjs';
import { RideHistoryItem } from '../../components/rides/RideHistoryItem';

type FilterPeriod = 'week' | 'month' | 'year';

export default function RidesPage() {
  const [filter, setFilter] = useState<FilterPeriod>('week');

  const { data: rideHistory = [], isLoading, isError } = useQuery<Reservation[], Error>({
    queryKey: ['rideHistory'],
    queryFn: reservationService.getRideHistory,
  });

  const filteredHistory = rideHistory
    .filter(ride => {
      if (!ride.endTime) return false;
      const rideEndTime = dayjs(ride.endTime);
      const now = dayjs();
      switch (filter) {
        case 'week':
          return rideEndTime.isAfter(now.subtract(1, 'week'));
        case 'month':
          return rideEndTime.isAfter(now.subtract(1, 'month'));
        case 'year':
          return rideEndTime.isAfter(now.subtract(1, 'year'));
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const timeA = a.endTime ? dayjs(a.endTime).valueOf() : 0;
      const timeB = b.endTime ? dayjs(b.endTime).valueOf() : 0;
      return timeB - timeA;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Ride History</h1>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['week', 'month', 'year'] as FilterPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === period
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 mx-auto text-primary-600 animate-spin mb-3" />
          <p className="text-gray-500">Loading ride history...</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700">
          <AlertCircle className="w-8 h-8 mx-auto mb-3" />
          <p className="font-medium">Failed to load ride history.</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && filteredHistory.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 font-medium">No rides found for the selected period.</p>
          <p className="text-gray-400 text-sm mt-1">Go take a ride!</p>
        </div>
      )}

      {!isLoading && !isError && filteredHistory.length > 0 && (
        <div>
          {filteredHistory.map((ride) => (
            <RideHistoryItem key={ride.id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  );
} 