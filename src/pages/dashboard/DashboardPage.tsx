import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BikeIcon,
  ClockIcon,
  AlertCircleIcon,
  CreditCardIcon,
  DollarSign,
  X,
  Crown,
  Zap,
  Loader2,
  WifiOff,
  Info,
  MapPin,
} from 'lucide-react';
import { formatPrice } from '../../utils/pricing';
import { useQuery, useMutation } from '@tanstack/react-query';
import { stationService, Station } from '../../lib/services/stationService';
import { reservationService, Reservation, EndRentalRequest, EndRentalResponse } from '../../lib/services/reservationService';
import StationSummaryCard from '../../components/station/StationSummaryCard';
import ReservationTimer from '../../components/reservation/ReservationTimer';
import { toast } from '../../components/ui/Toaster';
import { AppCombobox, ComboboxOption } from '../../components/ui/Combobox';
import { RideHistoryItem } from '../../components/rides/RideHistoryItem';
import dayjs from 'dayjs';

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [showEndRentalDialog, setShowEndRentalDialog] = useState(false);
  const [selectedReturnStation, setSelectedReturnStation] = useState<string | null>(null);

  // State for user location
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);

  // Get user location on mount
  useEffect(() => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          setLocationLoading(false);
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
          setLocationLoading(false);
        }
      );
    }
  }, []);

  // Fetch nearby stations using useQuery
  const { 
    data: nearbyStations = [], 
    isLoading: isLoadingStations, 
    isError: isErrorStations 
  } = useQuery<Station[], Error>({
    queryKey: ['nearbyStations', userLocation],
    queryFn: () => {
      if (!userLocation) return Promise.resolve([]); // Should not happen due to enabled flag
      return stationService.getNearbyStations(userLocation.latitude, userLocation.longitude, 1000); // Radius 1km
    },
    enabled: !!userLocation && !locationLoading, // Only run when location is available and not loading
  });

  // Fetch ALL stations (for the return dropdown)
  const { 
    data: allStations = [], 
    isLoading: isLoadingAllStations 
    // Optional: Add error handling if needed
  } = useQuery<Station[], Error>({
    queryKey: ['allStations'],
    queryFn: stationService.getMapStations,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Fetch active reservation
  const { 
    data: activeReservation, 
    isLoading: isLoadingActiveReservation, 
    refetch: refetchActiveReservation
  } = useQuery<Reservation | null, Error>(
    {
      queryKey: ['activeReservation'],
      queryFn: reservationService.getActiveReservation,
      staleTime: 1000 * 60, // Check for active reservation every minute or so
    }
  );

  // Fetch ride history for Recent Rides section
  const { 
    data: rideHistory = [], 
    isLoading: isLoadingHistory, 
    isError: isErrorHistory 
  } = useQuery<Reservation[], Error>({
    queryKey: ['rideHistoryDashboard'],
    queryFn: reservationService.getRideHistory,
  });

  // Sort and get the latest 3 rides
  const recentRides = rideHistory
    .filter(ride => !!ride.endTime) // Ensure ride is completed
    .sort((a, b) => dayjs(b.endTime!).valueOf() - dayjs(a.endTime!).valueOf()) // Sort latest first
    .slice(0, 3); // Get top 3

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

  // Mutation for ending the rental (Correct v5 syntax)
  const endRentalMutation = useMutation({
    mutationFn: ({ reservationId, data }: { reservationId: string; data: EndRentalRequest }) => 
      reservationService.endReservation(reservationId, data),
    onSuccess: (response: EndRentalResponse) => {
      if (response.success) {
        toast('success', response.message || 'Rental ended successfully!');
        setShowEndRentalDialog(false);
        setSelectedReturnStation(null);
        refetchActiveReservation(); // Refetch to update UI
      } else {
        toast('error', `Failed to end rental: ${response.message || 'Unknown error'}`);
      }
    },
    onError: (error: Error) => {
      console.error('Failed to end rental:', error);
      toast('error', 'Failed to end rental. Please try again.');
    },
  });

  // Updated function to handle the end rental button click
  const handleEndRental = () => {
    if (!selectedReturnStation || !activeReservation) return;

    endRentalMutation.mutate({
      reservationId: activeReservation.id,
      data: { returnStationId: selectedReturnStation }
    });
  };

  // Format allStations for the Combobox
  const stationOptions: ComboboxOption[] = allStations.map(station => ({
    id: station.id,
    name: station.name, 
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user?.fullName || 'Rider'}!</h1>
        <p className="text-primary-100">Ready for your next sustainable ride?</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-4 sm:space-y-6">
          {/* Active Rental Card - Improved Style */}
          {isLoadingActiveReservation ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <Loader2 className="w-6 h-6 mx-auto text-primary-600 animate-spin mb-2" />
              <span>Checking for active ride...</span>
            </div>
          ) : activeReservation ? (
            <div className="bg-blue-50 border border-blue-300 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                <h2 className="text-lg font-semibold text-blue-900">Active Rental</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  {activeReservation.bike.type === 'ELECTRIC' ? (
                    <Zap className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                  ) : (
                    <BikeIcon className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                  )}
                  <span className="font-medium text-gray-800">
                    {activeReservation.bike.type === 'ELECTRIC' ? 'Electric Bike' : 'Standard Bike'} #{activeReservation.bike.bikeNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 truncate" title={activeReservation.startStation.name}>
                      Started: {activeReservation.startStation.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      At: {new Date(activeReservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center col-span-2 sm:col-span-1">
                    <ReservationTimer
                      startTime={new Date(activeReservation.startTime)}
                      duration={activeReservation.durationMinutes}
                      onOverdue={() => { /* Handle overdue state */ }}
                    />
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      Est. Cost: {formatPrice(activeReservation.totalCost)}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-200">
                  <button
                    onClick={() => setShowEndRentalDialog(true)}
                    className="btn btn-warning w-full"
                  >
                    End Rental
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <Info className="w-6 h-6 mx-auto text-gray-500 mb-2" />
              <p className="text-gray-700">No active rental. Find a bike nearby!</p>
            </div>
          )}

          {/* Account Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Membership</span>
                <span className="font-medium text-green-600 flex items-center">
                  <Crown className="w-4 h-4 mr-1" /> Premium
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rides This Month</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Distance</span>
                <span className="font-medium text-gray-900">45.2 km</span>
              </div>
              <button className="btn btn-secondary w-full mt-2">Manage Account</button>
            </div>
          </div>
        </div>

        {/* Right Column - Nearby Stations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Nearby Stations</h2>
            <Link 
              to="/map" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {locationLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin mr-2" />
              <span>Getting your location...</span>
            </div>
          )}

          {locationError && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-red-600">
              <WifiOff className="w-8 h-8 mb-2" />
              <p className="font-medium">Could not get location:</p>
              <p className="text-sm">{locationError}</p>
              <p className="text-sm mt-2">Please ensure location services are enabled.</p>
            </div>
          )}

          {!locationLoading && !locationError && (
            <>
              {isLoadingStations && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin mr-2" />
                  <span>Loading nearby stations...</span>
                </div>
              )}

              {isErrorStations && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-red-600">
                  <AlertCircleIcon className="w-8 h-8 mb-2" />
                  <p className="font-medium">Could not load stations</p>
                  <p className="text-sm">There was an error fetching nearby stations. Please try again later.</p>
                </div>
              )}

              {!isLoadingStations && !isErrorStations && nearbyStations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No stations found within 1km of your current location.</p>
                </div>
              )}

              {!isLoadingStations && !isErrorStations && nearbyStations.length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                  {nearbyStations.map((station) => {
                    const distanceMeters = userLocation
                      ? calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          station.latitude,
                          station.longitude
                        )
                      : undefined;
                    const distanceKm = distanceMeters !== undefined ? distanceMeters / 1000 : undefined;
                    return (
                      <StationSummaryCard
                        key={station.id}
                        station={station}
                        distanceKm={distanceKm}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
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

      {/* Recent Rides Section - Updated */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Rides</h2>
          <Link 
            to="/rides" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        {isLoadingHistory ? (
          <div className="text-center py-6">
            <Loader2 className="w-6 h-6 mx-auto text-primary-600 animate-spin" />
          </div>
        ) : isErrorHistory ? (
          <div className="text-center py-6 text-red-600">
            <p>Error loading recent rides.</p>
          </div>
        ) : recentRides.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No recent rides found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRides.map((ride) => (
              <RideHistoryItem key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>

      {/* End Rental Dialog - Use Combobox */}
      {showEndRentalDialog && activeReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">End Your Ride</h3>
              <button 
                onClick={() => setShowEndRentalDialog(false)} 
                className="text-gray-400 hover:text-gray-600"
                disabled={endRentalMutation.isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select the station where you are returning the bike (Bike ID: {activeReservation.bike.bikeNumber}).
            </p>
            <div className="mb-4">
              <label htmlFor="returnStation" className="block text-sm font-medium text-gray-700 mb-1">
                Return Station
              </label>
              <AppCombobox 
                value={selectedReturnStation}
                onChange={setSelectedReturnStation}
                options={stationOptions}
                placeholder="-- Select a station --"
                disabled={endRentalMutation.isPending || isLoadingAllStations}
                isLoading={isLoadingAllStations}
              />
            </div>
            {endRentalMutation.isError && (
              <p className="text-sm text-red-600 mb-4">
                {endRentalMutation.error?.message || 'An error occurred.'}
              </p>
            )}
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowEndRentalDialog(false)} 
                className="btn btn-secondary"
                disabled={endRentalMutation.isPending}
              >
                Cancel
              </button>
              <button 
                onClick={handleEndRental} 
                className="btn btn-warning"
                disabled={!selectedReturnStation || endRentalMutation.isPending}
              >
                {endRentalMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ending...</>
                ) : (
                  'Confirm End Rental'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}