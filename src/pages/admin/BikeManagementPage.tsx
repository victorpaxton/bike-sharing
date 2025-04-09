import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Battery,
  AlertCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import { bikeService, Bike } from '../../lib/services/bikeService';
import { stationService } from '../../lib/services/stationService';

interface AddBikeFormData {
  bikeNumber: string;
  type: 'STANDARD' | 'ELECTRIC';
  stationId: string;
}

export default function BikeManagementPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
  const [stations, setStations] = useState<{ id: string; name: string }[]>([]);
  const [newBike, setNewBike] = useState<AddBikeFormData>({
    bikeNumber: '',
    type: 'STANDARD',
    stationId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stationSearchQuery, setStationSearchQuery] = useState('');
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bikesData, stationsData] = await Promise.all([
          bikeService.getBikes(),
          stationService.getMapStations(),
        ]);
        setBikes(bikesData);
        setStations(stationsData.map(station => ({ id: station.id, name: station.name })));
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddBike = async () => {
    if (!newBike.bikeNumber || !newBike.stationId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const createdBike = await bikeService.createBike(newBike.stationId, {
        bikeNumber: newBike.bikeNumber,
        type: newBike.type,
      });
      
      setBikes([createdBike, ...bikes]);
      setIsAddBikeOpen(false);
      setNewBike({
        bikeNumber: '',
        type: 'STANDARD',
        stationId: '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to create bike. Please try again later.');
      console.error('Error creating bike:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBikes = bikes.filter((bike) => {
    const matchesSearch = 
      bike.bikeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.currentStation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.currentStation.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === 'all' || bike.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      bike.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(stationSearchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Bike Management</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setIsAddBikeOpen(true)}
        >
              <Plus className="w-4 h-4 mr-2" />
              Add Bike
        </button>
      </div>

      {/* Add Bike Modal */}
      {isAddBikeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Bike</h2>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsAddBikeOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={newBike.bikeNumber}
                  onChange={(e) => setNewBike({ ...newBike, bikeNumber: e.target.value })}
                  placeholder="E-00001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={newBike.type}
                  onChange={(e) => setNewBike({ ...newBike, type: e.target.value as 'STANDARD' | 'ELECTRIC' })}
                >
                  <option value="STANDARD">Standard</option>
                  <option value="ELECTRIC">Electric</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onClick={() => setIsStationDropdownOpen(!isStationDropdownOpen)}
                  >
                    <span className="truncate">
                      {newBike.stationId
                        ? stations.find(s => s.id === newBike.stationId)?.name
                        : 'Select a station'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {isStationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Search stations..."
                            value={stationSearchQuery}
                            onChange={(e) => setStationSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredStations.length > 0 ? (
                          filteredStations.map((station) => (
                            <button
                              key={station.id}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100"
                              onClick={() => {
                                setNewBike({ ...newBike, stationId: station.id });
                                setIsStationDropdownOpen(false);
                                setStationSearchQuery('');
                              }}
                            >
                              {station.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            No stations found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsAddBikeOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddBike}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Bike'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by bike number, station name, or address..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="standard">Standard</option>
          <option value="electric">Electric</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="in_use">In Use</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Bikes List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bike Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bike.bikeNumber}
                  </div>
                    <div className="text-sm text-gray-500">
                      Year: {bike.manufactureYear}
                  </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        bike.type === 'ELECTRIC'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {bike.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        bike.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : bike.status === 'IN_USE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bike.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      {bike.currentStation.imageUrl && (
                        <img
                          src={bike.currentStation.imageUrl}
                          alt={bike.currentStation.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {bike.currentStation.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bike.currentStation.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bike.type === 'ELECTRIC' ? (
                      <div className="flex items-center">
                        <Battery className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {bike.batteryLevel}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-gray-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 