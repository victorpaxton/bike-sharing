import { useState } from 'react';
import { Navigation, Timer, DollarSign, MapPin } from 'lucide-react';
import { calculateRideCost, formatPrice } from '../../utils/pricing';

interface RideData {
  id: string;
  from: string;
  to: string;
  date: string;
  bikeId: string;
  distance: string;
  durationMinutes: number;
  isPremiumUser: boolean;
  ridesCompletedToday: number;
}

const mockRides: RideData[] = [
  {
    id: '1',
    from: 'Central Park Station',
    to: 'Times Square Station',
    date: 'Today, 8:30 AM',
    bikeId: 'B-12345',
    distance: '3.2 km',
    durationMinutes: 15,
    isPremiumUser: true,
    ridesCompletedToday: 0
  },
  {
    id: '2',
    from: 'Union Square Station',
    to: 'Brooklyn Bridge Station',
    date: 'Yesterday, 6:15 PM',
    bikeId: 'B-67890',
    distance: '5.1 km',
    durationMinutes: 25,
    isPremiumUser: true,
    ridesCompletedToday: 1
  },
  {
    id: '3',
    from: 'Battery Park Station',
    to: 'Hudson Yards Station',
    date: 'Saturday, 2:00 PM',
    bikeId: 'B-24680',
    distance: '8.7 km',
    durationMinutes: 45,
    isPremiumUser: true,
    ridesCompletedToday: 2
  }
];

const RideCard = ({ ride }: { ride: RideData }) => {
  const pricing = calculateRideCost({
    durationMinutes: ride.durationMinutes,
    distanceKm: parseFloat(ride.distance),
    isPremiumUser: ride.isPremiumUser,
    ridesCompletedToday: ride.ridesCompletedToday
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center text-gray-900">
            <span className="font-medium">{ride.from}</span>
            <MapPin className="w-4 h-4 mx-2 text-gray-400" />
            <span className="font-medium">{ride.to}</span>
          </div>
          <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500">
            <span>{ride.date}</span>
            <span className="text-gray-300">•</span>
            <span>Bike: {ride.bikeId}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-600">
            <Navigation className="w-4 h-4 mr-1.5 text-primary-500" />
            <span className="text-sm">{ride.distance}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Timer className="w-4 h-4 mr-1.5 text-primary-500" />
            <span className="text-sm">{ride.durationMinutes} min</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-1.5 text-primary-500" />
            <span className="text-sm">{formatPrice(pricing.totalCost)}</span>
          </div>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default function RidesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ride History</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {mockRides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </div>
  );
} 