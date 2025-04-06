import { useState } from 'react';
import { QrCode, Keyboard, AlertCircle } from 'lucide-react';

interface BikeUnlockProps {
  bikeId: string;
  onUnlock: () => void;
}

export default function BikeUnlock({ bikeId, onUnlock }: BikeUnlockProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    // In a real app, this would open the device camera for QR scanning
    // For now, we'll simulate a successful scan
    setTimeout(() => {
      setIsScanning(false);
      onUnlock();
    }, 2000);
  };

  const handleManualUnlock = () => {
    if (manualId === bikeId) {
      setError(null);
      onUnlock();
    } else {
      setError('Invalid bike ID. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Unlock Your Bike</h3>
        <p className="text-sm text-gray-500 mt-1">
          Scan the QR code on the bike or enter the bike ID manually
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
            isScanning
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <QrCode className="w-8 h-8 text-primary-600 mb-2" />
          <span className="text-sm font-medium">
            {isScanning ? 'Scanning...' : 'Scan QR Code'}
          </span>
        </button>

        <div className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200">
          <Keyboard className="w-8 h-8 text-primary-600 mb-2" />
          <span className="text-sm font-medium mb-2">Enter Bike ID</span>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value.toUpperCase())}
              placeholder="Enter ID"
              className="w-24 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleManualUnlock}
              className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        <p>Bike ID: {bikeId}</p>
      </div>
    </div>
  );
} 