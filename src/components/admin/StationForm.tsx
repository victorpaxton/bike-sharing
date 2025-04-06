import { useState, useEffect } from 'react';
import { MapPin, X, Save } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  standardBikes: number;
  electricBikes: number;
  availableDocks: number;
  status: 'active' | 'maintenance' | 'inactive';
  address: string;
  lastMaintenance: string;
}

interface StationFormProps {
  station?: Station;
  onSave: (station: Omit<Station, 'id'>) => void;
  onClose: () => void;
}

export default function StationForm({ station, onSave, onClose }: StationFormProps) {
  const [formData, setFormData] = useState<Omit<Station, 'id'>>({
    name: '',
    location: {
      lat: 0,
      lng: 0,
    },
    capacity: 0,
    standardBikes: 0,
    electricBikes: 0,
    availableDocks: 0,
    status: 'active',
    address: '',
    lastMaintenance: new Date().toISOString(),
  });

  useEffect(() => {
    if (station) {
      const { id: _, ...stationData } = station;
      setFormData(stationData);
    }
  }, [station]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate available docks before saving
    const availableDocks = formData.capacity - (formData.standardBikes + formData.electricBikes);
    onSave({
      ...formData,
      availableDocks,
    });
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {station ? 'Edit Station' : 'Add New Station'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Station Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter station name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter address"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.location.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          lat: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Latitude"
                    step="any"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.location.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          lng: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Longitude"
                    step="any"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLocationClick}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => {
                  const newCapacity = parseInt(e.target.value);
                  setFormData({
                    ...formData,
                    capacity: newCapacity,
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
                placeholder="Enter capacity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'maintenance' | 'inactive',
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Bikes
              </label>
              <input
                type="number"
                value={formData.standardBikes}
                onChange={(e) => {
                  const newStandardBikes = parseInt(e.target.value);
                  setFormData({
                    ...formData,
                    standardBikes: newStandardBikes,
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
                max={formData.capacity - formData.electricBikes}
                placeholder="Enter number of standard bikes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electric Bikes
              </label>
              <input
                type="number"
                value={formData.electricBikes}
                onChange={(e) => {
                  const newElectricBikes = parseInt(e.target.value);
                  setFormData({
                    ...formData,
                    electricBikes: newElectricBikes,
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
                max={formData.capacity - formData.standardBikes}
                placeholder="Enter number of electric bikes"
                required
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {station ? 'Save Changes' : 'Add Station'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 