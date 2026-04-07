import { useState, useCallback, useEffect } from 'react';
import { geolocationBridge, GeoPoint, useLocationUpdates } from 'react-native-geolocation-bridge';

export function useLocation() {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      let hasPermission = await geolocationBridge.hasLocationPermission();
      if (!hasPermission) {
        hasPermission = await geolocationBridge.requestLocationPermission();
      }
      return hasPermission;
    } catch (err) {
      console.error('Erro de permissão:', err);
      return false;
    }
  }, []);

  // Hook da sua biblioteca para atualizações em tempo real
  useLocationUpdates((point) => {
    setLocation(point);
  });

  useEffect(() => {
    const start = async () => {
      const granted = await checkPermission();
      if (granted) {
        // Inicia atualizações a cada 5 segundos ou 10 metros de deslocamento
        await geolocationBridge.startLocationUpdates(5000, 10);
      }
    };
    start();
    return () => {
      geolocationBridge.stopLocationUpdates();
    };
  }, [checkPermission]);

  return {
    location,
    error,
    calculateDistance: (lat2: number, lon2: number) => {
      if (!location) return null;
      return calculateHaversine(
        location.latitude,
        location.longitude,
        lat2,
        lon2
      );
    },
  };
}

/** Cálculo de distância Haversine em KM */
function calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
