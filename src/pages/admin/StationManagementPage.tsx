import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  List,
  Map,
  Plus,
  Search,
  Edit2,
  Trash2,
  Battery,
  Bike,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import StationForm from '../../components/admin/StationForm';
import { stationService, Station as ApiStation, CreateStationRequest } from '../../lib/services/stationService';

interface FormStation {
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

const mapApiToFormStation = (apiStation: ApiStation): FormStation => {
  return {
    id: apiStation.id,
    name: apiStation.name,
    location: {
      lat: apiStation.latitude,
      lng: apiStation.longitude,
    },
    capacity: apiStation.capacity,
    standardBikes: apiStation.availableStandardBikes,
    electricBikes: apiStation.availableElectricBikes,
    availableDocks: apiStation.capacity - (apiStation.availableStandardBikes + apiStation.availableElectricBikes),
    status: apiStation.status ? 'active' : 'inactive',
    address: apiStation.address,
    lastMaintenance: new Date().toISOString(), // Default to current date
  };
};

const mapFormToApiStation = (formStation: Omit<FormStation, 'id'>): Omit<ApiStation, 'id'> => {
  return {
    name: formStation.name,
    address: formStation.address,
    imageUrl: '', // Default empty image URL
    latitude: formStation.location.lat,
    longitude: formStation.location.lng,
    city: '', // Default empty city
    district: '', // Default empty district
    ward: '', // Default empty ward
    availableStandardBikes: formStation.standardBikes,
    availableElectricBikes: formStation.electricBikes,
    capacity: formStation.capacity,
    status: formStation.status === 'active',
    bikes: [], // Default empty bikes array
  };
};

export default function StationManagementPage() {
  const [stations, setStations] = useState<ApiStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<ApiStation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState<FormStation | undefined>();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        const data = await stationService.getMapStations();
        setStations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load stations. Please try again later.');
        console.error('Error fetching stations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || 
      (statusFilter === 'active' && station.status) ||
      (statusFilter === 'inactive' && !station.status);
    return matchesSearch && matchesStatus;
  });

  const handleAddStation = async (formData: CreateStationRequest) => {
    try {
      const newStation = await stationService.createStation(formData);
      // Add the new station at the beginning of the list
      setStations([newStation, ...stations]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating station:', err);
      // TODO: Show error toast/notification
    }
  };

  const handleEditStation = (formData: Omit<FormStation, 'id'>) => {
    if (editingStation) {
      // TODO: Implement API call to update station
      const updatedStations = stations.map((station) =>
        station.id === editingStation.id
          ? { ...mapFormToApiStation(formData), id: station.id }
          : station
      );
      setStations(updatedStations);
      setShowForm(false);
      setEditingStation(undefined);
    }
  };

  const handleDeleteStation = (stationId: string) => {
    // TODO: Implement API call to delete station
    setStations(stations.filter((station) => station.id !== stationId));
    if (selectedStation?.id === stationId) {
      setSelectedStation(null);
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleStationClick = async (station: ApiStation) => {
    try {
      setIsLoadingDetails(true);
      const detailedStation = await stationService.getStationById(station.id);
      setSelectedStation(detailedStation);
    } catch (err) {
      console.error('Error fetching station details:', err);
      // Keep the basic station info if detailed fetch fails
      setSelectedStation(station);
    } finally {
      setIsLoadingDetails(false);
    }
  };

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
        <h1 className="text-2xl font-semibold text-gray-900">
          Station Management
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              className={`px-3 py-1 rounded-md ${
                view === 'map'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600'
              }`}
              onClick={() => setView('map')}
            >
              <Map className="w-5 h-5" />
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                view === 'list'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600'
              }`}
              onClick={() => setView('list')}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button
            className="btn btn-primary flex items-center"
            onClick={() => {
              setEditingStation(undefined);
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Station
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stations..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {view === 'map' ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
              <MapContainer
                center={[10.762622, 106.660172]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredStations.map((station) => (
                  <Marker
                    key={station.id}
                    position={[station.latitude, station.longitude]}
                    eventHandlers={{
                      click: () => handleStationClick(station),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-medium">{station.name}</h3>
                        <p className="text-sm text-gray-600">{station.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Station
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStations.map((station) => (
                    <tr
                      key={station.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStationClick(station)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                            {station.imageUrl ? (
                              <img
                                src={station.imageUrl}
                                alt={`${station.name} station`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {station.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {station.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            station.status
                          )}`}
                        >
                          {station.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {station.capacity}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {station.availableStandardBikes} standard
                        </div>
                        <div className="text-sm text-gray-500">
                          {station.availableElectricBikes} electric
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStation(mapApiToFormStation(station));
                              setShowForm(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStation(station.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Station Details Panel */}
        {selectedStation && (
          <div className="w-80 bg-white rounded-lg shadow-sm p-6 space-y-6 h-fit">
            {isLoadingDetails ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                {selectedStation.imageUrl && (
                  <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden">
                    <img
                      src={selectedStation.imageUrl}
                      alt={`${selectedStation.name} station`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {selectedStation.name}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedStation.address}</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => {
                      setEditingStation(mapApiToFormStation(selectedStation));
                      setShowForm(true);
                    }}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Status
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedStation.status
                      )}`}
                    >
                      {selectedStation.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Capacity
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="text-lg font-medium text-gray-900">
                          {selectedStation.capacity}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Available</div>
                        <div className="text-lg font-medium text-gray-900">
                          {selectedStation.availableStandardBikes + selectedStation.availableElectricBikes}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Bikes
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-500">Standard</div>
                        <div className="text-lg font-medium text-gray-900">
                          {selectedStation.availableStandardBikes}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Electric</div>
                        <div className="text-lg font-medium text-gray-900">
                          {selectedStation.availableElectricBikes}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedStation.bikes && selectedStation.bikes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">
                        Bike List
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {selectedStation.bikes.map((bike) => (
                          <div
                            key={bike.id}
                            className="p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {bike.bikeNumber}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {bike.type}
                                </div>
                              </div>
                              {bike.type === 'ELECTRIC' && (
                                <div className="flex items-center">
                                  <Battery className="w-4 h-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">
                                    {bike.batteryLevel}%
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Status: {bike.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Location
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedStation.latitude.toFixed(4)},{' '}
                      {selectedStation.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Station Form Modal */}
      {showForm && (
        <StationForm
          onSave={handleAddStation}
          onClose={() => {
            setShowForm(false);
            setEditingStation(undefined);
          }}
        />
      )}
    </div>
  );
} 