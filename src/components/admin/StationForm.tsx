import { useState, useEffect, useRef } from 'react';
import { MapPin, X, Save, Upload } from 'lucide-react';
import { CreateStationRequest } from '../../lib/services/stationService';

interface StationFormProps {
  onSave: (station: CreateStationRequest) => void;
  onClose: () => void;
}

export default function StationForm({ onSave, onClose }: StationFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CreateStationRequest>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    city: '',
    district: '',
    ward: '',
    base64Image: '',
    capacity: 0,
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64String.split(',')[1];
        setFormData({ ...formData, base64Image: base64Data });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Add New Station</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Station Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Station Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="rounded-lg max-h-48 mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage('');
                          setFormData({ ...formData, base64Image: '' });
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            ref={fileInputRef}
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter district"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ward
              </label>
              <input
                type="text"
                value={formData.ward}
                onChange={(e) =>
                  setFormData({ ...formData, ward: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter ward"
                required
              />
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: parseFloat(e.target.value),
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
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: parseFloat(e.target.value),
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
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 