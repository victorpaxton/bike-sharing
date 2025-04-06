import { useState } from 'react';
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

const mockStations: Station[] = [
  {
    id: '1',
    name: 'Central Park Station',
    location: {
      lat: 40.7829,
      lng: -73.9654,
    },
    capacity: 20,
    standardBikes: 10,
    electricBikes: 5,
    availableDocks: 5,
    status: 'active',
    address: 'Central Park, New York, NY',
    lastMaintenance: '2024-03-15',
  },
  {
    id: '2',
    name: 'Times Square Hub',
    location: {
      lat: 40.758,
      lng: -73.9855,
    },
    capacity: 30,
    standardBikes: 15,
    electricBikes: 5,
    availableDocks: 10,
    status: 'maintenance',
    address: 'Times Square, New York, NY',
    lastMaintenance: '2024-04-01',
  },
];

export default function StationManagementPage() {
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | undefined>();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || station.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddStation = (stationData: Omit<Station, 'id'>) => {
    const newStation: Station = {
      ...stationData,
      id: Date.now().toString(),
    };
    setStations([...stations, newStation]);
    setShowForm(false);
  };

  const handleEditStation = (stationData: Omit<Station, 'id'>) => {
    if (editingStation) {
      const updatedStations = stations.map((station) =>
        station.id === editingStation.id
          ? { ...stationData, id: station.id }
          : station
      );
      setStations(updatedStations);
      setShowForm(false);
      setEditingStation(undefined);
    }
  };

  const handleDeleteStation = (stationId: string) => {
    setStations(stations.filter((station) => station.id !== stationId));
    if (selectedStation?.id === stationId) {
      setSelectedStation(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {view === 'map' ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
              <MapContainer
                center={[40.7829, -73.9654]}
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
                    position={[
                      station.location.lat,
                      station.location.lng,
                    ]}
                    eventHandlers={{
                      click: () => setSelectedStation(station),
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
                      onClick={() => setSelectedStation(station)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {station.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {station.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            station.status
                          )}`}
                        >
                          {station.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {station.capacity}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {station.standardBikes} standard
                        </div>
                        <div className="text-sm text-gray-500">
                          {station.electricBikes} electric
                        </div>
                        <div className="text-sm text-gray-500">
                          {station.availableDocks} docks
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStation(station);
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
                  setEditingStation(selectedStation);
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
                  {selectedStation.status}
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
                      {selectedStation.availableDocks}
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
                      {selectedStation.standardBikes}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Electric</div>
                    <div className="text-lg font-medium text-gray-900">
                      {selectedStation.electricBikes}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Last Maintenance
                </div>
                <div className="text-sm text-gray-900">
                  {new Date(selectedStation.lastMaintenance).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Location
                </div>
                <div className="text-sm text-gray-900">
                  {selectedStation.location.lat.toFixed(4)},{' '}
                  {selectedStation.location.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Station Form Modal */}
      {showForm && (
        <StationForm
          station={editingStation}
          onSave={editingStation ? handleEditStation : handleAddStation}
          onClose={() => {
            setShowForm(false);
            setEditingStation(undefined);
          }}
        />
      )}
    </div>
  );
} 