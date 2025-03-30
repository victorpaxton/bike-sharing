import { useState } from 'react';
import { Star, Battery, Clock, MapPin, ChevronRight, Bike, Zap, Shield, DollarSign } from 'lucide-react';

interface Bike {
  id: string;
  type: 'standard' | 'electric';
  thumbnail: string;
  batteryPercentage?: number;
  condition: number;
  pricePerHour: number;
}

const mockBikes: Bike[] = [
  {
    id: 'E-1234',
    type: 'electric',
    thumbnail: '/bike-electric.svg',
    batteryPercentage: 85,
    condition: 4.5,
    pricePerHour: 2.50,
  },
  {
    id: 'E-1235',
    type: 'electric',
    thumbnail: '/bike-electric.svg',
    batteryPercentage: 92,
    condition: 4.8,
    pricePerHour: 2.50,
  },
  {
    id: 'S-1236',
    type: 'standard',
    thumbnail: '/bike-standard.svg',
    condition: 4.2,
    pricePerHour: 1.50,
  },
];

const timeOptions = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

export default function ReservationPage() {
  const [selectedBike, setSelectedBike] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);

  const calculateCost = () => {
    const bike = mockBikes.find(b => b.id === selectedBike);
    if (!bike) return 0;
    return (bike.pricePerHour * selectedDuration) / 60;
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
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < bike.condition
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {bike.type === 'electric' && (
                        <div className="flex items-center text-gray-600 mt-1">
                          <Battery className="w-4 h-4 mr-1" />
                          <span>{bike.batteryPercentage}% battery</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600 mt-1">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{bike.pricePerHour}/hour</span>
                      </div>
                    </div>
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

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Base Rate</span>
                  <span>${selectedBike ? mockBikes.find(b => b.id === selectedBike)?.pricePerHour : '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Duration</span>
                  <span>{selectedDuration} minutes</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total Cost</span>
                  <span>${calculateCost().toFixed(2)}</span>
                </div>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  selectedBike
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedBike}
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 