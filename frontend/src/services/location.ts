import { Platform } from 'react-native';
import { LatLng } from '@/types';

/**
 * Web uses the browser Geolocation API. Native would swap in expo-location.
 * Returns null if unavailable/denied — the caller decides what to render.
 */
export const getUserLocation = async (): Promise<LatLng | null> => {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined' || !navigator.geolocation) {
    return null;
  }
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(t);
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        clearTimeout(t);
        resolve(null);
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 4000 },
    );
  });
};
