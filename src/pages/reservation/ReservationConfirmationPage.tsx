import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Bike, Zap, AlertTriangle, Unlock } from 'lucide-react';
import { formatPrice } from '../../utils/pricing';
import ReservationTimer from '../../components/reservation/ReservationTimer';
import BikeUnlock from '../../components/reservation/BikeUnlock';

interface ReservationDetails {
  bikeId: string;
  bikeType: 'standard' | 'electric';
  duration: number;
  stationName: string;
  stationAddress: string;
  totalCost: number;
  isPremiumUser: boolean;
}

export default function ReservationConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state as ReservationDetails;
  const [isOverdue, setIsOverdue] = useState(false);
  const [startTime] = useState(new Date());
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!reservation) {
    navigate('/reservation');
    return null;
  }

  const handleOverdue = () => {
    setIsOverdue(true);
    // In a real app, this would trigger notifications and penalties
  };

  const calculateOverduePenalty = () => {
    const overdueMinutes = Math.abs(Math.floor((new Date().getTime() - startTime.getTime()) / (1000 * 60)) - reservation.duration);
    const penaltyRate = 0.5; // $0.50 per minute
    return overdueMinutes * penaltyRate;
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    // In a real app, this would trigger the actual bike unlock mechanism
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900">Reservation Confirmed!</h1>
          <p className="text-gray-600 mt-2">Your bike is ready for pickup</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              {reservation.bikeType === 'electric' ? (
                <Zap className="w-5 h-5 text-primary-600 mr-3" />
              ) : (
                <Bike className="w-5 h-5 text-primary-600 mr-3" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {reservation.bikeType === 'electric' ? 'Electric Bike' : 'Standard Bike'} #{reservation.bikeId}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-gray-900">Duration: {reservation.duration} minutes</p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-gray-900">{reservation.stationName}</p>
                <p className="text-gray-600 text-sm">{reservation.stationAddress}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Cost</span>
                <span className="font-semibold text-gray-900">{formatPrice(reservation.totalCost)}</span>
              </div>
              {reservation.isPremiumUser && (
                <p className="text-xs text-green-600 mt-1">
                  Premium member benefits applied
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <ReservationTimer
                startTime={startTime}
                duration={reservation.duration}
                onOverdue={handleOverdue}
              />
            </div>

            {isOverdue && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-800">Bike Overdue</h3>
                    <p className="text-sm text-red-600 mt-1">
                      Please return the bike immediately to avoid additional charges.
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      Current penalty: {formatPrice(calculateOverduePenalty())}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isUnlocked ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <BikeUnlock bikeId={reservation.bikeId} onUnlock={handleUnlock} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center">
              <Unlock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Bike Unlocked!</h3>
              <p className="text-gray-600 mt-2">Your ride has started. Enjoy your trip!</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
          <ol className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">1</span>
              <span>Go to the station and find your reserved bike</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">2</span>
              <span>Scan the QR code on the bike or enter the bike ID in the app</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">3</span>
              <span>Your ride will start automatically once unlocked</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">4</span>
              <span>Return the bike to any station before your reservation expires</span>
            </li>
          </ol>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/map')}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            View on Map
          </button>
        </div>
      </div>
    </div>
  );
} 