import { useCallback, useEffect, useState } from 'react';
import { LatLng } from '@/types';
import { getUserLocation } from '@/services/location';

export const useUserLocation = () => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);

  // Best-effort background request on mount. Mobile Safari (and some Android
  // browsers) refuse geolocation without a user gesture, so this may silently
  // fail — that's why we also expose `request()` to be called from a tap.
  useEffect(() => {
    let mounted = true;
    getUserLocation().then((p) => {
      if (!mounted) return;
      if (p) setLocation(p);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const request = useCallback(async () => {
    const p = await getUserLocation();
    if (p) setLocation(p);
    return p;
  }, []);

  return { location, loading, request };
};
