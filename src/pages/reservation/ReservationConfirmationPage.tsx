import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Bike, Zap, AlertTriangle, Unlock } from 'lucide-react';
import { formatPrice } from '../../utils/pricing';
import ReservationTimer from '../../components/reservation/ReservationTimer';
import BikeUnlock from '../../components/reservation/BikeUnlock';
import { Reservation } from '../../lib/services/reservationService';

export default function ReservationConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state as Reservation | null;
  const [isOverdue, setIsOverdue] = useState(false);
  const [startTime] = useState(reservation ? new Date(reservation.startTime) : new Date());
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!reservation) {
      console.error("No reservation details found in location state.");
      navigate('/map', { replace: true });
    }
  }, [reservation, navigate]);

  if (!reservation) {
    return null;
  }

  const handleOverdue = () => {
    setIsOverdue(true);
    // Potentially trigger other actions like cancellation or notifications
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    // In a real app, this might trigger other state updates or effects
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900">Reservation Confirmed!</h1>
          <p className="text-gray-600 mt-2">Your bike is ready for pickup.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              {reservation.bike.type === 'ELECTRIC' ? (
                <Zap className="w-5 h-5 text-yellow-500 mr-3" />
              ) : (
                <Bike className="w-5 h-5 text-gray-500 mr-3" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {reservation.bike.type === 'ELECTRIC' ? 'Electric Bike' : 'Standard Bike'} # {reservation.bike.bikeNumber}
                </p>
                {reservation.bike.type === 'ELECTRIC' && reservation.bike.batteryLevel && (
                  <p className="text-sm text-gray-600">Battery: {reservation.bike.batteryLevel}%</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-gray-900">Duration: {reservation.durationMinutes} minutes</p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-gray-900">{reservation.startStation.name}</p>
                <p className="text-gray-600 text-sm">{reservation.startStation.address}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Cost</span>
                <span className="font-semibold text-gray-900">{formatPrice(reservation.totalCost)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <ReservationTimer
                startTime={startTime}
                duration={reservation.durationMinutes}
                onOverdue={handleOverdue}
              />
            </div>

            {isOverdue && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-800">Reservation Expired</h3>
                    <p className="text-sm text-red-600 mt-1">
                      Your reservation time has run out. Please make a new reservation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isUnlocked && !isOverdue && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <BikeUnlock bikeId={reservation.bike.bikeNumber} onUnlock={handleUnlock} />
          </div>
        )}

        {isUnlocked && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center">
              <Unlock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Bike Unlocked!</h3>
              <p className="text-gray-600 mt-2">Your ride has started. Enjoy your trip!</p>
            </div>
          </div>
        )}

        {!isUnlocked && !isOverdue && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">1</span>
                <span>Go to the station ({reservation.startStation.name}) and find your bike ({reservation.bike.bikeNumber})</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">2</span>
                <span>Use the 'Unlock Your Bike' section above or scan the QR code on the bike</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">3</span>
                <span>Your ride will start automatically once unlocked</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">4</span>
                <span>Return the bike to any station before your reservation expires ({formatTime(reservation.durationMinutes * 60)})</span>
              </li>
            </ol>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {!isUnlocked && !isOverdue && (
            <button
              onClick={() => { /* TODO: Implement Cancel Reservation API call */ }}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel Reservation
            </button>
          )}
          <button
            onClick={() => navigate('/map')}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {isUnlocked ? 'Back to Map' : 'Find Station on Map'}
          </button>
        </div>
      </div>
    </div>
  );
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}; 