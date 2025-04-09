import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Battery, MapPin, Bike as BikeIcon, Zap, X, ParkingCircle, Loader2 } from 'lucide-react';
import BikeReviews from '../../components/reservation/BikeReviews';
import { stationService, Bike, Station } from '../../lib/services/stationService';
import { reviewService } from '../../lib/services/reviewService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { calculateRideCost, formatPrice, PRICING_PLANS } from '../../utils/pricing';
import { reservationService, CreateReservationRequest, CreateReservationResponse } from '../../lib/services/reservationService';
import { toast } from '../../components/ui/Toaster';

const timeOptions = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
];

export default function ReservationPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(60); // Default to 1 hour
  const [bikeTypeFilter, setBikeTypeFilter] = useState<'all' | 'standard' | 'electric'>('all');
  const isPremiumUser = true; // This should come from user context/auth state

  // Fetch station data
  const { data: station, isLoading: isLoadingStation, isError: isErrorStation } = useQuery<Station, Error>({
    queryKey: ['station', stationId],
    queryFn: () => stationService.getStationById(stationId!),
    enabled: !!stationId,
  });

  // Fetch reviews when a bike is selected
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ['bikeReviews', selectedBike?.id],
    queryFn: () => reviewService.getBikeReviews(selectedBike!.id),
    enabled: !!selectedBike,
  });

  // Calculate average rating and total reviews
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
  const totalReviews = reviews.length;

  // Calculate estimated pricing
  const estimatedPricing = selectedBike ? calculateRideCost({
    durationMinutes: selectedDuration,
    distanceKm: 0, // Distance is not known at reservation time
    isPremiumUser,
    ridesCompletedToday: 0 // This should come from user's ride history
  }) : null;

  // Mutation for creating the reservation
  const createReservationMutation = useMutation<CreateReservationResponse, Error, CreateReservationRequest>({
    mutationFn: reservationService.createReservation,
    onSuccess: (response) => {
      if (response.success) {
        toast(
          'success', 
          `Reservation Successful! Bike ${response.data.bike.bikeNumber} reserved for ${response.data.durationMinutes} minutes.`
        );
        navigate(`/reservation/confirmation`, { state: response.data }); 
      } else {
        toast(
          'error', 
          `Reservation Failed: ${response.message || "Could not reserve the bike. It might have been taken."}`
        );
      }
    },
    onError: (error) => {
      console.error("Reservation creation error:", error);
      toast(
        'error', 
        `Reservation Error: An unexpected error occurred. Please try again.`
      );
    },
  });

  // Function to handle the reservation button click
  const handleReserveClick = () => {
    if (!selectedBike || !stationId) return;

    createReservationMutation.mutate({
      bikeId: selectedBike.id,
      stationId: stationId,
      durationMinutes: selectedDuration,
    });
  };

  if (isLoadingStation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isErrorStation || !station) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Station Not Found</h2>
        <p className="text-gray-600 mb-4">The station you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/map')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Map
        </button>
      </div>
    );
  }

  // Filter bikes based on type, ensuring station.bikes exists
  const filteredBikes = (station?.bikes || []).filter(bike => {
    if (bikeTypeFilter === 'all') return true;
    return bike.type.toLowerCase() === bikeTypeFilter;
  });

  // Calculate available docks
  const totalAvailableBikes = station.availableStandardBikes + station.availableElectricBikes;
  const availableDocks = station.capacity - totalAvailableBikes;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Station info and bikes */}
          <div className="flex-1">
            {/* Station Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={station.imageUrl}
                      alt={station.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{station.name}</h1>
                    <div className="flex items-center text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{station.address}, {station.ward}, {station.district}, {station.city}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <BikeIcon className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{station.availableStandardBikes} Standard</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 text-primary-500 mr-1" />
                        <span className="text-sm text-gray-600">{station.availableElectricBikes} Electric</span>
                      </div>
                      {typeof station.capacity === 'number' && (
                        <div className="flex items-center">
                          <ParkingCircle className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            Dock: {availableDocks}/{station.capacity} can be used
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bike Type Filter */}
            <div className="px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex space-x-4">
                <button
                  onClick={() => setBikeTypeFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    bikeTypeFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setBikeTypeFilter('standard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    bikeTypeFilter === 'standard' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setBikeTypeFilter('electric')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    bikeTypeFilter === 'electric' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Electric
                </button>
              </div>
            </div>

            {/* Available Bikes */}
            <div className="px-4 py-8 sm:px-6 lg:px-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Bikes</h2>
              {filteredBikes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBikes.map((bike) => (
                    <div
                      key={bike.id}
                      className={`bg-white rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedBike?.id === bike.id
                          ? 'border-primary-500'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedBike(bike)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">{bike.bikeNumber}</h3>
                            <p className="text-sm text-gray-500">{bike.type} Bike</p>
                          </div>
                          {bike.type === 'ELECTRIC' && (
                            <div className="flex items-center">
                              <Battery className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-gray-600">{bike.batteryLevel}%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBike(bike);
                              setShowReviews(true);
                            }}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            View Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No bikes of the selected type are currently available at this station.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Reservation Summary */}
          <div className="lg:w-96 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservation Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled={createReservationMutation.isPending}
                  >
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBike && estimatedPricing && (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Base Rate</span>
                      <span>{formatPrice(estimatedPricing.breakdown.baseRate)}</span>
                    </div>
                    {estimatedPricing.breakdown.minutesCost > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Time Cost ({selectedDuration} minutes)</span>
                        <span>{formatPrice(estimatedPricing.breakdown.minutesCost)}</span>
                      </div>
                    )}
                    {estimatedPricing.breakdown.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Premium Discount</span>
                        <span>-{formatPrice(estimatedPricing.breakdown.discount)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between font-semibold text-gray-900">
                        <span>Estimated Cost</span>
                        <span>{formatPrice(estimatedPricing.totalCost)}</span>
                      </div>
                      {isPremiumUser && selectedDuration <= PRICING_PLANS.PREMIUM.freeMinutes && (
                        <p className="text-xs text-green-600 mt-1">
                          This ride will be free with your Premium plan!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReserveClick}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors flex items-center justify-center ${
                    selectedBike && !createReservationMutation.isPending
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedBike || createReservationMutation.isPending}
                >
                  {createReservationMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Reserving...</>
                  ) : (
                    'Confirm Reservation'
                  )}
                </button>

                {isPremiumUser && (
                  <p className="text-xs text-gray-500 text-center">
                    Premium member benefits applied automatically
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      {showReviews && selectedBike && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Reviews for {selectedBike.bikeNumber}
                </h3>
                <button
                  onClick={() => setShowReviews(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {isLoadingReviews ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <BikeReviews
                  reviews={reviews}
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 