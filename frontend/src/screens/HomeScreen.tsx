import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteId, SimConfig } from '@/types';
import { colors } from '@/theme/colors';
import { ROUTES, routeById } from '@/data/routes';
import Map from '@/components/Map/Map';
import { ETABanner, QueueItem } from '@/components/ETABanner';
import { ReportFab } from '@/components/ReportFab';
import { SuggestStopFab } from '@/components/SuggestStopFab';
import { NearestStopButton } from '@/components/NearestStopButton';
import { SimControls } from '@/components/SimControls';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useCoasters } from '@/hooks/useCoasters';
import { useCustomStops } from '@/hooks/useCustomStops';
import { DEFAULT_SIM, computeEta, computeWalk } from '@/services/eta';
import { haversine, progressAlongPath } from '@/utils/geo';

type Props = {
  routeId: RouteId;
  onChangeRoute: (id: RouteId) => void;
  onOpenReport: (mode: 'sighting' | 'stop') => void;
};

const MAX_QUEUE = 4;

export const HomeScreen: React.FC<Props> = ({ routeId, onChangeRoute, onOpenReport }) => {
  const baseRoute = routeById(routeId)!;
  const { location, request: requestLocation } = useUserLocation();
  const coasters = useCoasters(routeId);
  const { stops: customStops, confirm: confirmStop } = useCustomStops(routeId);
  const [selectedStopName, setSelectedStopName] = useState<string | null>(null);
  const [sim, setSim] = useState<SimConfig>(DEFAULT_SIM);

  const route = useMemo(
    () => ({ ...baseRoute, stops: [...baseRoute.stops, ...customStops] }),
    [baseRoute, customStops],
  );

  const selectedStop = useMemo(
    () => route.stops.find((s) => s.name === selectedStopName) ?? null,
    [route, selectedStopName],
  );

  useEffect(() => {
    setSelectedStopName(null);
  }, [routeId]);

  const queue: QueueItem[] = useMemo(() => {
    if (!selectedStop || selectedStop.pending) return [];
    const stopProg = progressAlongPath(selectedStop.point, route.path);
    return coasters
      .map((c) => {
        const cProg = progressAlongPath(c.position, route.path);
        return { coaster: c, gap: stopProg - cProg };
      })
      .filter((x) => x.gap > 0)
      .sort((a, b) => a.gap - b.gap)
      .slice(0, MAX_QUEUE)
      .map(({ coaster }) => {
        const eta = computeEta(coaster, route, selectedStop.point, sim);
        return eta ? { coaster, eta } : null;
      })
      .filter((x): x is QueueItem => !!x);
  }, [coasters, selectedStop, route, sim]);

  const walk = useMemo(() => {
    if (!location || !selectedStop) return null;
    return computeWalk(location, selectedStop.point);
  }, [location, selectedStop]);

  const selectNearestStop = async () => {
    // Fall back to asking for location now — mobile browsers refuse the
    // background request from `useUserLocation` on mount without a gesture.
    const point = location ?? (await requestLocation());
    if (!point) return;
    // Only verified stops — pending ones aren't trustworthy enough to
    // suggest as "your stop" automatically.
    let best: { name: string; d: number } | null = null;
    for (const s of route.stops) {
      if (s.pending) continue;
      const d = haversine(point, s.point);
      if (!best || d < best.d) best = { name: s.name, d };
    }
    if (best) setSelectedStopName(best.name);
  };

  const otherRoutes = useMemo(() => ROUTES.filter((r) => r.id !== routeId), [routeId]);
  const center =
    selectedStop?.point ?? location ?? route.path[Math.floor(route.path.length / 2)];

  return (
    <View style={styles.wrap}>
      <Map
        center={center}
        zoom={13}
        route={route}
        otherRoutes={otherRoutes}
        coasters={coasters}
        userLocation={location}
        highlightedCoasterId={queue[0]?.coaster.id}
        selectedStopName={selectedStopName ?? undefined}
        onStopTap={setSelectedStopName}
      />

      <ETABanner
        routes={ROUTES}
        selectedId={routeId}
        onSelect={onChangeRoute}
        selectedStop={selectedStop ?? undefined}
        onClearStop={selectedStop ? () => setSelectedStopName(null) : undefined}
        onConfirmStop={
          selectedStop?.pending ? () => confirmStop(selectedStop.name) : undefined
        }
        queue={queue}
        walk={walk}
      />

      <NearestStopButton onPress={selectNearestStop} />

      <SuggestStopFab onPress={() => onOpenReport('stop')} />
      <ReportFab onPress={() => onOpenReport('sighting')} />

      <SimControls value={sim} onChange={setSim} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
});
