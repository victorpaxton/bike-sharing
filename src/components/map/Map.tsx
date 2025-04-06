import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bike } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Station {
    id: string;
    name: string;
  address: string;
  distance: string;
    availableBikes: number;
  availableEBikes: number;
  coordinates: { lat: number; lng: number };
  image: string;
}

// Mock data for stations
const mockStations: Station[] = [
  {
    id: '1',
    name: 'Ben Thanh Metro Station',
    address: '1 Le Loi Street, District 1, Ho Chi Minh City',
    distance: '0.3 km',
    availableBikes: 8,
    availableEBikes: 5,
    coordinates: { lat: 10.7719, lng: 106.6982 },
    image: '/stations/ben-thanh.jpg',
  },
  {
    id: '2',
    name: 'Opera House Station',
    address: '7 Lam Son Square, District 1, Ho Chi Minh City',
    distance: '0.5 km',
    availableBikes: 6,
    availableEBikes: 4,
    coordinates: { lat: 10.7769, lng: 106.7032 },
    image: '/stations/opera-house.jpg',
  },
  {
    id: '3',
    name: 'Ba Son Metro Station',
    address: '2 Ton Duc Thang Street, District 1, Ho Chi Minh City',
    distance: '0.7 km',
    availableBikes: 7,
    availableEBikes: 3,
    coordinates: { lat: 10.7836, lng: 106.7047 },
    image: '/stations/ba-son.jpg',
  },
  {
    id: '4',
    name: 'Thu Thiem Metro Station',
    address: 'Thu Thiem New Urban Area, District 2, Ho Chi Minh City',
    distance: '1.2 km',
    availableBikes: 5,
    availableEBikes: 4,
    coordinates: { lat: 10.7872, lng: 106.7223 },
    image: '/stations/thu-thiem.jpg',
  },
  {
    id: '5',
    name: 'Saigon River Park Station',
    address: 'Ton Duc Thang Street, District 1, Ho Chi Minh City',
    distance: '0.9 km',
    availableBikes: 4,
    availableEBikes: 6,
    coordinates: { lat: 10.7823, lng: 106.7065 },
    image: '/stations/saigon-river.jpg',
  },
  {
    id: '6',
    name: 'Landmark 81 Station',
    address: '720A Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City',
    distance: '1.5 km',
    availableBikes: 9,
    availableEBikes: 7,
    coordinates: { lat: 10.7949, lng: 106.7219 },
    image: '/stations/landmark-81.jpg',
  },
  {
    id: '7',
    name: 'VNU-HCM Station',
    address: 'Linh Trung Ward, Thu Duc City, Ho Chi Minh City',
    distance: '2.1 km',
    availableBikes: 10,
    availableEBikes: 8,
    coordinates: { lat: 10.8700, lng: 106.8030 },
    image: '/stations/vnu-hcm.jpg',
  },
  {
    id: '8',
    name: 'Thu Duc Market Station',
    address: 'Thu Duc Market, Thu Duc City, Ho Chi Minh City',
    distance: '2.3 km',
    availableBikes: 6,
    availableEBikes: 4,
    coordinates: { lat: 10.8497, lng: 106.7539 },
    image: '/stations/thu-duc-market.jpg',
  },
  {
    id: '9',
    name: 'Thu Thiem 2 Bridge Station',
    address: 'Near Thu Thiem 2 Bridge, Thu Duc City, Ho Chi Minh City',
    distance: '2.5 km',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 10.7942, lng: 106.7501 },
    image: '/stations/thu-thiem-bridge.jpg',
  },
  {
    id: '10',
    name: 'High-Tech Park Station',
    address: 'Saigon High-Tech Park, Thu Duc City, Ho Chi Minh City',
    distance: '3.0 km',
    availableBikes: 12,
    availableEBikes: 10,
    coordinates: { lat: 10.8456, lng: 106.7944 },
    image: '/stations/high-tech-park.jpg',
  },
  {
    id: '11',
    name: 'Thu Duc Lake Park Station',
    address: 'Thu Duc Lake Park, Thu Duc City, Ho Chi Minh City',
    distance: '2.8 km',
    availableBikes: 7,
    availableEBikes: 5,
    coordinates: { lat: 10.8600, lng: 106.7800 },
    image: '/stations/thu-duc-lake.jpg',
  },
  {
    id: '12',
    name: 'Linh Trung Station',
    address: 'Linh Trung Ward, Thu Duc City, Ho Chi Minh City',
    distance: '0.5 km',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 10.8200, lng: 106.7820 },
    image: '/stations/linh-trung.jpg',
  },
  {
    id: '13',
    name: 'Hi-Tech Park Gate 1',
    address: 'Entrance 1, Saigon High-Tech Park, Thu Duc City',
    distance: '0.8 km',
    availableBikes: 10,
    availableEBikes: 8,
    coordinates: { lat: 10.8250, lng: 106.7850 },
    image: '/stations/hitech-gate1.jpg',
  },
  {
    id: '14',
    name: 'Hi-Tech Park Gate 2',
    address: 'Entrance 2, Saigon High-Tech Park, Thu Duc City',
    distance: '1.0 km',
    availableBikes: 9,
    availableEBikes: 7,
    coordinates: { lat: 10.8300, lng: 106.7900 },
    image: '/stations/hitech-gate2.jpg',
  },
  {
    id: '15',
    name: 'Linh Trung Export Processing Zone',
    address: 'Linh Trung Export Processing Zone, Thu Duc City',
    distance: '1.2 km',
    availableBikes: 7,
    availableEBikes: 5,
    coordinates: { lat: 10.8350, lng: 106.7950 },
    image: '/stations/linh-trung-epz.jpg',
  },
  {
    id: '16',
    name: 'Thu Duc College Station',
    address: 'Thu Duc College, Thu Duc City, Ho Chi Minh City',
    distance: '1.5 km',
    availableBikes: 6,
    availableEBikes: 4,
    coordinates: { lat: 10.8400, lng: 106.8000 },
    image: '/stations/thu-duc-college.jpg',
  },
  {
    id: '17',
    name: 'Hi-Tech Park Research Center',
    address: 'Research Center, Saigon High-Tech Park, Thu Duc City',
    distance: '1.8 km',
    availableBikes: 11,
    availableEBikes: 9,
    coordinates: { lat: 10.8450, lng: 106.8050 },
    image: '/stations/hitech-research.jpg',
  },
  {
    id: '18',
    name: 'Hanoi Highway Station 1',
    address: 'Near Thu Duc Intersection, Hanoi Highway, Thu Duc City',
    distance: '2.0 km',
    availableBikes: 9,
    availableEBikes: 7,
    coordinates: { lat: 10.8500, lng: 106.7600 },
    image: '/stations/hanoi-highway-1.jpg',
  },
  {
    id: '19',
    name: 'Hanoi Highway Station 2',
    address: 'Near VNU-HCM, Hanoi Highway, Thu Duc City',
    distance: '2.2 km',
    availableBikes: 8,
    availableEBikes: 6,
    coordinates: { lat: 10.8550, lng: 106.7650 },
    image: '/stations/hanoi-highway-2.jpg',
  },
  {
    id: '20',
    name: 'Hanoi Highway Station 3',
    address: 'Near Hi-Tech Park, Hanoi Highway, Thu Duc City',
    distance: '2.5 km',
    availableBikes: 10,
    availableEBikes: 8,
    coordinates: { lat: 10.8600, lng: 106.7700 },
    image: '/stations/hanoi-highway-3.jpg',
  },
  {
    id: '21',
    name: 'Hanoi Highway Station 4',
    address: 'Near Thu Duc College, Hanoi Highway, Thu Duc City',
    distance: '2.8 km',
    availableBikes: 7,
    availableEBikes: 5,
    coordinates: { lat: 10.8650, lng: 106.7750 },
    image: '/stations/hanoi-highway-4.jpg',
  },
  {
    id: '22',
    name: 'Hanoi Highway Station 5',
    address: 'Near Linh Trung EPZ, Hanoi Highway, Thu Duc City',
    distance: '3.0 km',
    availableBikes: 11,
    availableEBikes: 9,
    coordinates: { lat: 10.8700, lng: 106.7800 },
    image: '/stations/hanoi-highway-5.jpg',
  }
];

// Custom hook for getting user's location
const useUserLocation = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

      navigator.geolocation.getCurrentPosition(
        (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
        },
        (error) => {
        setError('Unable to retrieve your location');
        console.error('Error getting location:', error);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, []);

  return { location, error, loading };
};

// Component to recenter map on user's location
function RecenterMap({ userLocation }: { userLocation: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return null;
}

// Custom marker icons
const stationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedStationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -34],
  shadowSize: [51, 51],
  className: 'selected-marker'
});

const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  selectedStation: Station | null;
  onMapRef: (map: LeafletMap) => void;
}

// Component to handle routing
function Routing({ userLocation, selectedStation }: { userLocation: [number, number] | null; selectedStation: Station | null }) {
  const map = useMap();
  const routeRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (userLocation && selectedStation) {
      // Remove existing route if any
      if (routeRef.current) {
        routeRef.current.remove();
      }

      // Fetch route from OSRM
      fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${selectedStation.coordinates.lng},${selectedStation.coordinates.lat}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            const route = data.routes[0].geometry.coordinates;
            const routeLine = L.polyline(route.map((coord: [number, number]) => [coord[1], coord[0]]), {
              color: '#4F46E5',
              weight: 5,
              opacity: 0.7
            }).addTo(map);
            routeRef.current = routeLine;
          }
        })
        .catch(err => console.error('Error fetching route:', err));
    } else if (routeRef.current) {
      // Remove route when no station is selected
      routeRef.current.remove();
      routeRef.current = null;
    }

    return () => {
      if (routeRef.current) {
        routeRef.current.remove();
      }
    };
  }, [userLocation, selectedStation, map]);

  return null;
}

export default function Map({ selectedStation, onMapRef }: MapProps) {
  const { location: userLocation, error: locationError, loading } = useUserLocation();
  const navigate = useNavigate();
  const defaultCenter: [number, number] = [10.818436, 106.780596]; // Ho Chi Minh City coordinates
  const mapRef = useRef(null);

  return (
    <div className="relative h-full z-10">
      {loading && (
        <div className="absolute top-4 right-4 z-[1000] bg-blue-100 text-blue-700 px-4 py-2 rounded-md">
          Getting your location...
        </div>
      )}
      
      {locationError && (
        <div className="absolute top-4 right-4 z-[1000] bg-red-100 text-red-700 px-4 py-2 rounded-md">
          {locationError}
        </div>
      )}
      
      <MapContainer
        ref={mapRef}
        center={userLocation || defaultCenter}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-medium">Your Location</p>
                <p className="text-sm text-gray-600">
                  {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {mockStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates.lat, station.coordinates.lng]}
            icon={selectedStation?.id === station.id ? selectedStationIcon : stationIcon}
            eventHandlers={{
              click: () => {
                navigate(`/reservation/${station.id}`);
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg mb-1">{station.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{station.address}</p>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center">
                    <Bike className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{station.availableBikes} Standard</span>
                  </div>
                  <div className="flex items-center">
                    <Bike className="w-4 h-4 text-primary-500 mr-1" />
                    <span className="text-sm text-gray-600">{station.availableEBikes} Electric</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">Distance: {station.distance}</p>
                <button
                  onClick={() => navigate(`/reservation/${station.id}`)}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors"
                >
                  Reserve a Bike
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterMap userLocation={userLocation} />
        <MapController selectedStation={selectedStation} onMapRef={onMapRef} />
        <Routing userLocation={userLocation} selectedStation={selectedStation} />
      </MapContainer>
    </div>
  );
}

// Component to handle map interactions
function MapController({ selectedStation, onMapRef }: MapProps) {
  const map = useMap();
  
  useEffect(() => {
    onMapRef(map);
  }, [map, onMapRef]);

  useEffect(() => {
    if (selectedStation) {
      map.setView([selectedStation.coordinates.lat, selectedStation.coordinates.lng], 18);
    }
  }, [selectedStation, map]);

  return null;
} 