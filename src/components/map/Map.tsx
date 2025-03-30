import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  stations?: Array<{
    id: string;
    name: string;
    location: [number, number];
    availableBikes: number;
  }>;
}

export const Map = ({ 
  center = [-74.5, 40], // Default center (New York area)
  zoom = 9,
  stations = []
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('Initializing map...');
    map.current = L.map(mapContainer.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Get user's location
  useEffect(() => {
    console.log('Requesting location...');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location received:', { latitude, longitude });
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  // Update map view when user location is available
  useEffect(() => {
    if (map.current && userLocation) {
      console.log('Updating map view to user location:', userLocation);
      map.current.setView(userLocation, 13);
      
      // Remove any existing user location marker
      markers.current.forEach(marker => {
        if (marker.getElement()?.classList.contains('user-location-marker')) {
          marker.remove();
        }
      });

      // Add user location marker
      const userMarker = L.marker(userLocation, {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: `
            <div class="w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-md"></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map.current);

      markers.current.push(userMarker);
    }
  }, [userLocation]);

  // Add markers for stations
  useEffect(() => {
    if (!map.current) return;

    console.log('Adding station markers...');
    // Remove existing station markers
    markers.current = markers.current.filter(marker => {
      if (marker.getElement()?.classList.contains('station-marker')) {
        marker.remove();
        return false;
      }
      return true;
    });

    // Add new markers
    stations.forEach(station => {
      const marker = L.marker(station.location)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-medium">${station.name}</h3>
            <p class="text-sm text-gray-600">${station.availableBikes} bikes available</p>
          </div>
        `)
        .addTo(map.current!);

      // Create custom icon
      const icon = L.divIcon({
        className: 'station-marker',
        html: `
          <div class="bg-white rounded-full p-2 shadow-md">
            <div class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              ${station.availableBikes}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      marker.setIcon(icon);
      markers.current.push(marker);
    });
  }, [stations]);

  return (
    <div className="w-full h-full">
      {locationError && (
        <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-md shadow-sm z-10">
          <p className="text-sm text-gray-600">{locationError}</p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <style>{`
        .station-marker {
          cursor: pointer;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .user-location-marker {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}; 