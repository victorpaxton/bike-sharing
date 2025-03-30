import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Map } from '../../components/map/Map';
import {
  BikeIcon,
  ClockIcon,
  AlertCircleIcon,
  CreditCardIcon,
  Bike,
  Navigation,
  Timer,
  DollarSign,
  Map as MapIcon,
  X
} from 'lucide-react';

const quickActions = [
  {
    name: 'Find a Bike',
    description: 'View available bikes near you',
    href: '/map',
    icon: BikeIcon,
    color: 'bg-primary-500',
  },
  {
    name: 'Recent Rides',
    description: 'View your ride history',
    href: '/rides',
    icon: ClockIcon,
    color: 'bg-indigo-500',
  },
  {
    name: 'Report Issue',
    description: 'Report a problem with a bike',
    href: '/report',
    icon: AlertCircleIcon,
    color: 'bg-yellow-500',
  },
  {
    name: 'Billing',
    description: 'Manage your subscription',
    href: '/billing',
    icon: CreditCardIcon,
    color: 'bg-green-500',
  },
];

interface RideCardProps {
  title: string;
  date: string;
  bikeId: string;
  distance: string;
  duration: string;
  cost: string;
}

const RideCard = ({ title, date, bikeId, distance, duration, cost }: RideCardProps) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{bikeId}</p>
      </div>
      <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{date}</span>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-center mb-1">
          <Navigation className="w-5 h-5 text-primary-600" />
        </div>
        <div className="font-semibold text-gray-900 text-center">{distance}</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-center mb-1">
          <Timer className="w-5 h-5 text-primary-600" />
        </div>
        <div className="font-semibold text-gray-900 text-center">{duration}</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-center mb-1">
          <DollarSign className="w-5 h-5 text-primary-600" />
        </div>
        <div className="font-semibold text-gray-900 text-center">{cost}</div>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-100">
      <button className="w-full flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
        <MapIcon className="w-4 h-4" />
        <span>View Route</span>
      </button>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeRental] = useState({
    id: 'RENT-001',
    bikeId: 'BIKE-123',
    startTime: '2024-02-20T10:00:00',
    station: 'Central Park South',
    status: 'active',
    duration: '00:37:15',
    currentCost: '$0.00',
  });
  const [showEndRentalDialog, setShowEndRentalDialog] = useState(false);
  const [isEndingRental, setIsEndingRental] = useState(false);
  const [endRentalError, setEndRentalError] = useState<string | null>(null);

  const handleEndRental = async () => {
    setIsEndingRental(true);
    setEndRentalError(null);
    
    try {
      // TODO: Call your API to end the rental
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      // Show success message
      setShowEndRentalDialog(false);
      // TODO: Update the active rental state
    } catch (error: unknown) {
      console.error('Error ending rental:', error);
      setEndRentalError('Failed to end rental. Please try again.');
    } finally {
      setIsEndingRental(false);
    }
  };

  // Sample station data
  const stations = [
    {
      id: '1',
      name: 'Central Park South',
      location: [-73.9754, 40.7644] as [number, number],
      availableBikes: 12
    },
    {
      id: '2',
      name: 'Times Square',
      location: [-73.9855, 40.7580] as [number, number],
      availableBikes: 8
    },
    {
      id: '3',
      name: 'Union Square',
      location: [-73.9907, 40.7357] as [number, number],
      availableBikes: 15
    },
    {
      id: '4',
      name: 'Bryant Park',
      location: [-73.9832, 40.7536] as [number, number],
      availableBikes: 6
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </div>
        <Link
          to="/map"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Find a Bike
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Active Rental Card - Square on the left */}
        <div className="col-span-4">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm p-6 h-[350px]">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-lg font-semibold text-green-900">Active Rental</h2>
            </div>
            {activeRental ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Bike ID</span>
                  <span className="font-medium text-green-900">{activeRental.bikeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Station</span>
                  <span className="font-medium text-green-900">{activeRental.station}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Started</span>
                  <span className="font-medium text-green-900">
                    {new Date(activeRental.startTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Duration</span>
                  <span className="font-medium text-green-900">{activeRental.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Current Cost</span>
                  <span className="font-medium text-green-900">{activeRental.currentCost}</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={() => setShowEndRentalDialog(true)}
                    className="flex-1 px-4 py-2 bg-error text-white rounded-md hover:bg-error/90 transition-colors"
                  >
                    End Rental
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Report Issue
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bike className="w-12 h-12 mb-4" />
                <p>No active rental</p>
                <Link
                  to="/map"
                  className="mt-4 text-primary-600 hover:text-primary-700"
                >
                  Find a bike
                </Link>
              </div>
            )}
          </div>

          {/* Premium Plan Subscription */}
          <div className="bg-primary-50 rounded-md p-4 mt-6">
            <p className="font-semibold text-primary-900 mb-1">Premium Monthly Plan</p>
            <p className="text-primary-700 text-sm mb-1">Valid until: April 30, 2025</p>
            <p className="text-primary-700 text-sm mb-3">Unlimited 60-minute rides</p>
            <button className="w-full px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-8">
          {/* Account Summary - Horizontal */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Balance</div>
                <div className="text-2xl font-bold text-gray-900">${user?.balance.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Rides</div>
                <div className="text-2xl font-bold text-gray-900">24</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Distance</div>
                <div className="text-2xl font-bold text-gray-900">156 km</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Points</div>
                <div className="text-2xl font-bold text-gray-900">1,250</div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="h-[400px] relative">
              <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-md shadow-sm z-10">
                <h2 className="text-lg font-semibold">Available Bikes Near You</h2>
              </div>
              <Map 
                center={[-73.9855, 40.7580]} // Times Square coordinates
                zoom={13}
                stations={stations}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Full Width */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">{action.name}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Rides - Full Width */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
          <Link to="/rides" className="text-primary-600 hover:text-primary-700 text-sm">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RideCard
            title="City Hall to Financial District"
            date="Mar 29, 2025"
            bikeId="E-Bike #E-5678"
            distance="4.2 km"
            duration="17 min"
            cost="$0.00"
          />
          <RideCard
            title="Riverside Park to Union Square"
            date="Mar 28, 2025"
            bikeId="Regular Bike #R-9012"
            distance="6.7 km"
            duration="28 min"
            cost="$0.00"
          />
          <RideCard
            title="Central Park to Bryant Park"
            date="Mar 26, 2025"
            bikeId="E-Bike #E-3456"
            distance="3.1 km"
            duration="12 min"
            cost="$0.00"
          />
        </div>
      </div>

      {/* End Rental Dialog */}
      {showEndRentalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">End Rental</h2>
              <button
                onClick={() => setShowEndRentalDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {endRentalError ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                {endRentalError}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Rental Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{activeRental.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance</span>
                      <span className="font-medium">4.2 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-medium text-primary-600">{activeRental.currentCost}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleEndRental}
                    disabled={isEndingRental}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEndingRental ? 'Ending Rental...' : 'Confirm End Rental'}
                  </button>
                  <button
                    onClick={() => setShowEndRentalDialog(false)}
                    disabled={isEndingRental}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 