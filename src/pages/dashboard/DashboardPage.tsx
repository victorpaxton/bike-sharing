import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  X,
  Wallet,
  Route,
  Award,
  Crown,
  MapPin,
  Zap
} from 'lucide-react';
import { calculateRideCost, formatPrice } from '../../utils/pricing';

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
  from: string;
  to: string;
  date: string;
  bikeId: string;
  distance: string;
  durationMinutes: number;
  isPremiumUser: boolean;
  ridesCompletedToday: number;
}

const RideCard = ({ 
  from, 
  to, 
  date, 
  bikeId, 
  distance, 
  durationMinutes,
  isPremiumUser,
  ridesCompletedToday 
}: RideCardProps) => {
  const pricing = calculateRideCost({
    durationMinutes,
    distanceKm: parseFloat(distance),
    isPremiumUser,
    ridesCompletedToday
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-gray-600">
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">From</span>
            </div>
            <p className="text-sm sm:text-base text-gray-900">{from}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-gray-600">
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">To</span>
            </div>
            <p className="text-sm sm:text-base text-gray-900">{to}</p>
          </div>
      </div>
        <div className="flex flex-col items-end text-right space-y-1">
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            {date}
          </span>
          <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded">
            <span className="text-xs font-medium text-gray-500">Bike:</span>
            <span className="text-xs text-gray-600">{bikeId}</span>
    </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
        <div className="flex items-center justify-center mb-1">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          </div>
          <div className="font-semibold text-gray-900 text-center text-xs sm:text-sm">{distance}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
          <div className="flex items-center justify-center mb-1">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          </div>
          <div className="font-semibold text-gray-900 text-center text-xs sm:text-sm">
            {durationMinutes} min
          </div>
      </div>
      
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
        <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          </div>
          <div className="font-semibold text-gray-900 text-center text-xs sm:text-sm">
            {formatPrice(pricing.totalCost)}
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Base Rate:</span>
            <span>{formatPrice(pricing.breakdown.baseRate)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Time Cost:</span>
            <span>{formatPrice(pricing.breakdown.minutesCost)}</span>
          </div>
          {pricing.breakdown.discount > 0 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Discount:</span>
              <span>-{formatPrice(pricing.breakdown.discount)}</span>
            </div>
          )}
    </div>
        <button className="w-full flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium">
          <MapIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>View Route</span>
      </button>
    </div>
  </div>
);
};

interface Station {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableBikes: number;
  availableEBikes: number;
  coordinates: { lat: number; lng: number };
  image: string;
  distanceInMeters?: number;
}

// Import mockStations from MapPage (in real app, this would be from a shared data source)
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

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeRental, setActiveRental] = useState<{
    id: string;
    startTime: string;
    bikeId: string;
    station: string;
    duration: string;
    currentCost: string;
    timeRemaining: string;
  } | null>({
    id: 'RENT-001',
    bikeId: 'BIKE-123',
    startTime: '2024-02-20T10:00:00',
    station: 'Central Park South',
    duration: '00:37:15',
    currentCost: '$0.00',
    timeRemaining: '30 min',
  });
  const [showEndRentalDialog, setShowEndRentalDialog] = useState(false);
  const [isEndingRental, setIsEndingRental] = useState(false);
  const [endRentalError, setEndRentalError] = useState<string | null>(null);
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [selectedReturnStation, setSelectedReturnStation] = useState<string | null>(null);

  // Calculate distance between two points using Haversine formula
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

    return R * c; // Distance in meters
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Filter stations within 1km
          const nearby = mockStations
            .map(station => ({
              ...station,
              distanceInMeters: calculateDistance(
                userLoc.lat,
                userLoc.lng,
                station.coordinates.lat,
                station.coordinates.lng
              )
            }))
            .filter(station => station.distanceInMeters <= 1000)
            .sort((a, b) => a.distanceInMeters - b.distanceInMeters)
            .slice(0, 5); // Show top 5 nearest stations

          setNearbyStations(nearby);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Add useEffect to update time remaining
  useEffect(() => {
    if (activeRental) {
      const interval = setInterval(() => {
        const startTime = new Date(activeRental.startTime);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        const remainingMinutes = Math.max(0, 30 - diffInMinutes); // Assuming 30 min rental period
        
        setActiveRental(prev => prev ? {
          ...prev,
          timeRemaining: `${remainingMinutes} min`
        } : null);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeRental]);

  const handleEndRental = async () => {
    setIsEndingRental(true);
    setEndRentalError(null);
    
    try {
      // TODO: Call your API to end the rental
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      // Show success message
      setShowEndRentalDialog(false);
      setActiveRental(null);
    } catch (error: unknown) {
      console.error('Error ending rental:', error);
      setEndRentalError('Failed to end rental. Please try again.');
    } finally {
      setIsEndingRental(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-4 sm:space-y-6">
          {/* Active Rental Card */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-base sm:text-lg font-semibold text-green-900">Active Rental</h2>
            </div>
            {activeRental ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-green-700">Bike ID</p>
                    <p className="font-medium text-green-900 text-sm sm:text-base">{activeRental.bikeId}</p>
                </div>
                  <div>
                    <p className="text-xs sm:text-sm text-green-700">Station</p>
                    <p className="font-medium text-green-900 text-sm sm:text-base">{activeRental.station}</p>
                </div>
                  <div>
                    <p className="text-xs sm:text-sm text-green-700">Started</p>
                    <p className="font-medium text-green-900 text-sm sm:text-base">
                    {new Date(activeRental.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-green-700">Duration</p>
                    <p className="font-medium text-green-900 text-sm sm:text-base">{activeRental.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-green-700">Time Remaining</p>
                    <p className="font-medium text-green-900 text-sm sm:text-base">{activeRental.timeRemaining}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-green-700">Current Cost</p>
                    <p className="font-medium text-green-900 text-sm sm:text-base">{activeRental.currentCost}</p>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button 
                    onClick={() => setShowEndRentalDialog(true)}
                    className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-error text-white rounded-md hover:bg-error-600 transition-colors text-xs sm:text-sm"
                  >
                    End Rental
                  </button>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                    Report Issue
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-gray-500">
                <Bike className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base">No active rental</p>
                <Link
                  to="/map"
                  className="mt-3 sm:mt-4 text-primary-600 hover:text-primary-700 text-sm sm:text-base"
                >
                  Find a bike
                </Link>
              </div>
            )}
          </div>

          {/* Account Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Account Summary</h2>
            
            {/* Current Plan */}
            <div className="bg-primary-50 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 rounded-lg p-2">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-primary-900 text-sm sm:text-base">Premium Plan</div>
                  <div className="text-xs sm:text-sm text-primary-700">Unlimited 60-minute rides</div>
                </div>
                <div className="ml-auto text-xs sm:text-sm text-primary-700">
                  Valid until Apr 30, 2025
                </div>
          </div>
        </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-1 sm:mb-2">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                  <div className="text-xs sm:text-sm text-gray-600">Balance</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">${user?.balance?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-1 sm:mb-2">
                  <BikeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                  <div className="text-xs sm:text-sm text-gray-600">Total Rides</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">24</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-1 sm:mb-2">
                  <Route className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                  <div className="text-xs sm:text-sm text-gray-600">Distance</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">156 km</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-1 sm:mb-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                  <div className="text-xs sm:text-sm text-gray-600">Points</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">1,250</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Nearby Stations */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nearby Stations</h2>
            <Link 
              to="/map" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {nearbyStations.map((station) => (
              <Link
                key={station.id}
                to={`/reservation/${station.id}`}
                className="block hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between p-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{station.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{station.address}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Bike className="w-4 h-4 mr-1" />
                        <span>{station.availableBikes} bikes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Zap className="w-4 h-4 mr-1" />
                        <span>{station.availableEBikes} e-bikes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{station.distanceInMeters ? (station.distanceInMeters / 1000).toFixed(1) : '?'} km</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <img
                      src={station.image}
                      alt={station.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </Link>
            ))}

            {nearbyStations.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">No stations found within 1km</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
            className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
            >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3`}>
              <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{action.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{action.description}</p>
            </Link>
          ))}
      </div>

      {/* Recent Rides */}
      <div>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Recent Rides</h2>
          <Link to="/rides" className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <RideCard
            from="Central Park Station"
            to="Times Square Station"
            date="Today, 8:30 AM"
            bikeId="B-12345"
            distance="3.2 km"
            durationMinutes={15}
            isPremiumUser={true}
            ridesCompletedToday={0}
          />
          <RideCard
            from="Union Square Station"
            to="Brooklyn Bridge Station"
            date="Yesterday, 6:15 PM"
            bikeId="B-67890"
            distance="5.1 km"
            durationMinutes={25}
            isPremiumUser={true}
            ridesCompletedToday={1}
          />
          <RideCard
            from="Battery Park Station"
            to="Hudson Yards Station"
            date="Saturday, 2:00 PM"
            bikeId="B-24680"
            distance="8.7 km"
            durationMinutes={45}
            isPremiumUser={true}
            ridesCompletedToday={2}
          />
        </div>
      </div>

      {/* End Rental Dialog */}
      {showEndRentalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">End Rental</h2>
              <button
                onClick={() => setShowEndRentalDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {endRentalError ? (
              <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-md mb-3 sm:mb-4 text-sm">
                {endRentalError}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">Rental Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Duration</span>
                      <span className="font-medium text-sm sm:text-base">{activeRental?.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Distance</span>
                      <span className="font-medium text-sm sm:text-base">4.2 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Total Cost</span>
                      <span className="font-medium text-sm sm:text-base text-primary-600">{activeRental?.currentCost}</span>
                    </div>
                  </div>
                </div>

                {/* Station Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Return Station
                  </label>
                  <select
                    value={selectedReturnStation || ''}
                    onChange={(e) => setSelectedReturnStation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="">Select a station</option>
                    {nearbyStations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} ({station.distance})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleEndRental}
                    disabled={isEndingRental || !selectedReturnStation}
                    className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    {isEndingRental ? 'Ending Rental...' : 'Confirm End Rental'}
                  </button>
                  <button
                    onClick={() => setShowEndRentalDialog(false)}
                    disabled={isEndingRental}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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