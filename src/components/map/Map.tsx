import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bike } from 'lucide-react';
import { Station } from '../../lib/services/stationService';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  selectedStation: Station | null;
  onMapRef: (map: LeafletMap) => void;
  stations: Station[];
  isLoading: boolean;
}

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

// Component to handle routing between user location and selected station
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
      fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${selectedStation.longitude},${selectedStation.latitude}?overview=full&geometries=geojson`)
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

// Component to handle map interactions
function MapController({ selectedStation, onMapRef }: { selectedStation: Station | null; onMapRef: (map: LeafletMap) => void }) {
  const map = useMap();
  
  useEffect(() => {
    onMapRef(map);
  }, [map, onMapRef]);

  useEffect(() => {
    if (selectedStation) {
      map.setView([selectedStation.latitude, selectedStation.longitude], 18);
    }
  }, [selectedStation, map]);

  return null;
}

export default function Map({ selectedStation, onMapRef, stations }: MapProps) {
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

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
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
                    <span className="text-sm text-gray-600">{station.availableStandardBikes} Standard</span>
                  </div>
                  <div className="flex items-center">
                    <Bike className="w-4 h-4 text-primary-500 mr-1" />
                    <span className="text-sm text-gray-600">{station.availableElectricBikes} Electric</span>
                  </div>
                </div>
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