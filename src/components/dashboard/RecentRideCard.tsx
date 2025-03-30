import { Bike, MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { RecentRide } from '../../types/ride';

type RecentRideCardProps = {
  ride: RecentRide;
};

const RecentRideCard = ({ ride }: RecentRideCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <Bike className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {ride.startStation} → {ride.endStation}
          </h3>
          <p className="text-sm text-gray-500">{ride.date}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>

    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="w-4 h-4 mr-1" />
        <span>{ride.duration}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{ride.distance}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <DollarSign className="w-4 h-4 mr-1" />
        <span>{ride.cost}</span>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between">
      <span className="text-xs text-gray-500 capitalize">{ride.bikeType} bike</span>
      <button className="text-sm text-primary-600 hover:text-primary-700">
        View Details
      </button>
    </div>
  </div>
);

export default RecentRideCard; 