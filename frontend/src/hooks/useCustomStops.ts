import { useCallback, useEffect, useState } from 'react';
import { RouteId, RouteStop } from '@/types';
import { api, _mockState } from '@/services/api';

/**
 * Reflects api.suggestStop mutations back into React state. Simple polling
 * matches how listCoasters works — a real backend would push over WebSocket.
 */
export const useCustomStops = (routeId: RouteId) => {
  const [stops, setStops] = useState<RouteStop[]>([]);

  const refresh = useCallback(() => {
    setStops([...(_mockState.customStops[routeId] ?? [])]);
  }, [routeId]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1000);
    return () => clearInterval(t);
  }, [refresh]);

  const add = useCallback(
    async (stop: RouteStop) => {
      await api.suggestStop(routeId, stop);
      refresh();
    },
    [routeId, refresh],
  );

  const confirm = useCallback(
    async (name: string) => {
      await api.confirmStop(routeId, name);
      refresh();
    },
    [routeId, refresh],
  );

  return { stops, add, confirm };
};
