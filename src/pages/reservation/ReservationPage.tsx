import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Battery, Clock, MapPin, ChevronRight, Bike, Zap, X } from 'lucide-react';
import { calculateRideCost, formatPrice, PRICING_PLANS } from '../../utils/pricing';
import BikeReviews from '../../components/reservation/BikeReviews';

interface Bike {
  id: string;
  type: 'standard' | 'electric';
  thumbnail: string;
  batteryPercentage?: number;
  condition: number;
  reviews: {
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
      id: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
}

const mockBikes: Bike[] = [
  {
    id: 'B-001',
    type: 'standard',
    thumbnail: '/bikes/standard-1.jpg',
    condition: 4.5,
    reviews: {
      averageRating: 4.2,
      totalReviews: 12,
      reviews: [
        {
          id: 'R-001',
          userId: 'U-001',
          userName: 'John Doe',
          rating: 5,
          comment: 'Great bike, very comfortable ride!',
          date: '2024-02-15',
        },
        {
          id: 'R-002',
          userId: 'U-002',
          userName: 'Jane Smith',
          rating: 4,
          comment: 'Good condition, smooth ride.',
          date: '2024-02-10',
        },
      ],
    },
  },
  {
    id: 'E-1234',
    type: 'electric',
    thumbnail: '/bike-electric.svg',
    batteryPercentage: 85,
    condition: 4.5,
    reviews: {
      averageRating: 4.5,
      totalReviews: 10,
      reviews: [
        {
          id: 'R-003',
          userId: 'U-003',
          userName: 'Alice Johnson',
          rating: 5,
          comment: 'Excellent bike, great battery life!',
          date: '2024-02-12',
        },
        {
          id: 'R-004',
          userId: 'U-004',
          userName: 'Bob Brown',
          rating: 4,
          comment: 'Good bike, but battery life could be better.',
          date: '2024-02-08',
        },
      ],
    },
  },
  {
    id: 'E-1235',
    type: 'electric',
    thumbnail: '/bike-electric.svg',
    batteryPercentage: 92,
    condition: 4.8,
    reviews: {
      averageRating: 4.7,
      totalReviews: 8,
      reviews: [
        {
          id: 'R-005',
          userId: 'U-005',
          userName: 'Eve Adams',
          rating: 5,
          comment: 'Perfect bike, highly recommended!',
          date: '2024-02-05',
        },
        {
          id: 'R-006',
          userId: 'U-006',
          userName: 'Charlie Davis',
          rating: 4,
          comment: 'Good bike, but expensive.',
          date: '2024-02-02',
        },
      ],
    },
  },
  {
    id: 'S-1236',
    type: 'standard',
    thumbnail: '/bike-standard.svg',
    condition: 4.2,
    reviews: {
      averageRating: 4.1,
      totalReviews: 6,
      reviews: [
        {
          id: 'R-007',
          userId: 'U-007',
          userName: 'Grace Evans',
          rating: 4,
          comment: 'Good bike, but not as comfortable as expected.',
          date: '2024-01-30',
        },
        {
          id: 'R-008',
          userId: 'U-008',
          userName: 'Frank Miller',
          rating: 4,
          comment: 'Average bike, could be better.',
          date: '2024-01-25',
        },
      ],
    },
  },
];

const timeOptions = [
  { value: 0.25, label: '15 seconds' }, // 0.25 minutes = 15 seconds
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

export default function ReservationPage() {
  const navigate = useNavigate();
  const [selectedBike, setSelectedBike] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedBikeForReviews, setSelectedBikeForReviews] = useState<Bike | null>(null);
  const isPremiumUser = true; // This should come from user context/auth state

  const handleViewReviews = (bike: Bike) => {
    setSelectedBikeForReviews(bike);
    setShowReviews(true);
  };

  const pricing = selectedBike ? calculateRideCost({
    durationMinutes: selectedDuration,
    distanceKm: 0, // Distance is not known at reservation time
    isPremiumUser,
    ridesCompletedToday: 0 // This should come from user's ride history
  }) : null;

  const handleConfirmReservation = async () => {
    if (!selectedBike || !pricing) return;

    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to create the reservation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const selectedBikeDetails = mockBikes.find(b => b.id === selectedBike);
      if (!selectedBikeDetails) return;

      navigate('/reservation/confirmation', {
        state: {
          bikeId: selectedBike,
          bikeType: selectedBikeDetails.type,
          duration: selectedDuration,
          stationName: 'Central Park Station',
          stationAddress: '123 Park Avenue, New York, NY',
          totalCost: pricing.totalCost,
          isPremiumUser
        }
      });
    } catch (error) {
      console.error('Failed to create reservation:', error);
      // In a real app, you would show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Station Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Central Park Station</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>123 Park Avenue, New York, NY</span>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              <span>Open 24/7</span>
            </div>
          </div>
          <button className="text-primary-600 hover:text-primary-700 flex items-center">
            <span className="mr-1">Get Directions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bike List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Bikes</h2>
            <div className="space-y-4">
              {mockBikes.map((bike) => (
                <div
                  key={bike.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedBike === bike.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedBike(bike.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {bike.type === 'electric' ? (
                        <Zap className="w-12 h-12 text-primary-600" />
                      ) : (
                        <Bike className="w-12 h-12 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {bike.type === 'electric' ? 'Electric Bike' : 'Standard Bike'} #{bike.id}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {bike.reviews.averageRating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({bike.reviews.totalReviews})
                          </span>
                        </div>
                      </div>
                      {bike.type === 'electric' && (
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Battery className="w-4 h-4 mr-1" />
                          <span>{bike.batteryPercentage}% battery</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReviews(bike);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reservation Summary */}
        <div className="lg:col-span-1">
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
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBike && pricing && (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Base Rate</span>
                    <span>{formatPrice(pricing.breakdown.baseRate)}</span>
                  </div>
                  {pricing.breakdown.minutesCost > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Time Cost ({selectedDuration} minutes)</span>
                      <span>{formatPrice(pricing.breakdown.minutesCost)}</span>
                    </div>
                  )}
                  {pricing.breakdown.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Premium Discount</span>
                      <span>-{formatPrice(pricing.breakdown.discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total Cost</span>
                      <span>{formatPrice(pricing.totalCost)}</span>
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
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  selectedBike && !isLoading
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedBike || isLoading}
                onClick={handleConfirmReservation}
              >
                {isLoading ? 'Processing...' : 'Confirm Reservation'}
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

      {/* Reviews Modal */}
      {showReviews && selectedBikeForReviews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Reviews for {selectedBikeForReviews.type === 'electric' ? 'Electric' : 'Standard'} Bike #{selectedBikeForReviews.id}
              </h2>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BikeReviews
              reviews={selectedBikeForReviews.reviews.reviews}
              averageRating={selectedBikeForReviews.reviews.averageRating}
              totalReviews={selectedBikeForReviews.reviews.totalReviews}
            />
          </div>
        </div>
      )}
    </div>
  );
} 