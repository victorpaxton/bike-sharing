import { useState } from 'react';
import { Bike, Zap, Star, MapPin, AlertCircle, Wrench, Plus, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";

interface Bike {
  id: string;
  type: 'standard' | 'electric';
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  currentStation: string;
  batteryPercentage?: number;
  lastMaintenance: string;
  totalRides: number;
  averageRating: number;
  totalReviews: number;
}

interface AddBikeFormData {
  type: 'standard' | 'electric';
  currentStation: string;
}

const mockBikes: Bike[] = [
  {
    id: 'B-001',
    type: 'standard',
    status: 'available',
    currentStation: 'Central Park Station',
    lastMaintenance: '2024-02-15',
    totalRides: 45,
    averageRating: 4.2,
    totalReviews: 12,
  },
  {
    id: 'E-1234',
    type: 'electric',
    status: 'in-use',
    currentStation: 'Times Square Station',
    batteryPercentage: 85,
    lastMaintenance: '2024-02-10',
    totalRides: 32,
    averageRating: 4.5,
    totalReviews: 10,
  },
  {
    id: 'B-002',
    type: 'standard',
    status: 'maintenance',
    currentStation: 'Maintenance Center',
    lastMaintenance: '2024-02-18',
    totalRides: 78,
    averageRating: 4.0,
    totalReviews: 15,
  },
  {
    id: 'E-1235',
    type: 'electric',
    status: 'out-of-service',
    currentStation: 'Maintenance Center',
    batteryPercentage: 0,
    lastMaintenance: '2024-02-20',
    totalRides: 120,
    averageRating: 4.3,
    totalReviews: 25,
  },
];

const mockStations = [
  'Central Park Station',
  'Times Square Station',
  'Brooklyn Bridge Station',
  'Grand Central Station',
  'Maintenance Center',
];

type SortField = 'id' | 'type' | 'status' | 'currentStation' | 'lastMaintenance' | 'totalRides' | 'averageRating';
type SortOrder = 'asc' | 'desc';

export default function BikeManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [bikes, setBikes] = useState<Bike[]>(mockBikes);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
  const [newBike, setNewBike] = useState<AddBikeFormData>({
    type: 'standard',
    currentStation: mockStations[0],
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddBike = () => {
    const bikeId = newBike.type === 'standard' 
      ? `B-${String(bikes.length + 1).padStart(3, '0')}`
      : `E-${String(bikes.length + 1).padStart(4, '0')}`;

    const bike: Bike = {
      id: bikeId,
      type: newBike.type,
      status: 'available',
      currentStation: newBike.currentStation,
      lastMaintenance: new Date().toISOString().split('T')[0],
      totalRides: 0,
      averageRating: 0,
      totalReviews: 0,
      ...(newBike.type === 'electric' && { batteryPercentage: 100 }),
    };

    setBikes([...bikes, bike]);
    setIsAddBikeOpen(false);
    setNewBike({ type: 'standard', currentStation: mockStations[0] });
  };

  const handleStatusChange = (bikeId: string, newStatus: Bike['status']) => {
    setBikes(bikes.map(bike => 
      bike.id === bikeId 
        ? { 
            ...bike, 
            status: newStatus,
            currentStation: newStatus === 'maintenance' ? 'Maintenance Center' : bike.currentStation
          }
        : bike
    ));
  };

  const sortedAndFilteredBikes = bikes
    .filter((bike) => {
      const matchesSearch = bike.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bike.currentStation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || bike.status === selectedStatus;
      const matchesType = selectedType === 'all' || bike.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) return -1 * multiplier;
      if (fieldA > fieldB) return 1 * multiplier;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'in-use':
        return 'text-blue-600 bg-blue-50';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50';
      case 'out-of-service':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Bike Management</h1>
        <Dialog open={isAddBikeOpen} onOpenChange={setIsAddBikeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bike
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bike</DialogTitle>
              <DialogDescription>
                Add a new bike to the system. The bike will be set as available at the selected station.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Bike Type
                </label>
                <Select
                  value={newBike.type}
                  onValueChange={(value: 'standard' | 'electric') => 
                    setNewBike({ ...newBike, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="station" className="text-sm font-medium">
                  Station
                </label>
                <Select
                  value={newBike.currentStation}
                  onValueChange={(value) => 
                    setNewBike({ ...newBike, currentStation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStations.map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBikeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBike}>Add Bike</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by ID or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out-of-service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('id')}>
                ID {sortField === 'id' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('type')}>
                Type {sortField === 'type' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('status')}>
                Status {sortField === 'status' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('currentStation')}>
                Location {sortField === 'currentStation' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('totalRides')}>
                Rides {sortField === 'totalRides' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('averageRating')}>
                Rating {sortField === 'averageRating' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="w-[140px] cursor-pointer" onClick={() => handleSort('lastMaintenance')}>
                Last Maintenance {sortField === 'lastMaintenance' && <ArrowUpDown className="inline w-4 h-4 ml-1" />}
              </TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredBikes.map((bike) => (
              <TableRow key={bike.id}>
                <TableCell className="font-medium">{bike.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {bike.type === 'electric' ? (
                      <Zap className="w-4 h-4 text-primary-600 mr-1" />
                    ) : (
                      <Bike className="w-4 h-4 text-primary-600 mr-1" />
                    )}
                    {bike.type === 'electric' ? 'Electric' : 'Standard'}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={bike.status}
                    onValueChange={(value: Bike['status']) => handleStatusChange(bike.id, value)}
                  >
                    <SelectTrigger className={`w-[130px] h-7 ${getStatusColor(bike.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="out-of-service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    {bike.currentStation}
                  </div>
                </TableCell>
                <TableCell>{bike.totalRides}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    {bike.averageRating.toFixed(1)} ({bike.totalReviews})
                  </div>
                </TableCell>
                <TableCell>{bike.lastMaintenance}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(bike.id, 'maintenance')}
                    >
                      <Wrench className="w-4 h-4 mr-1" />
                      Maintenance
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(bike.id, 'out-of-service')}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Issue
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 