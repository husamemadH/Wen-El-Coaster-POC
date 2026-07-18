import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { RouteId } from './src/types';
import { ROUTES } from './src/data/routes';
import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { I18nProvider } from './src/i18n/I18nContext';

type Screen = { name: 'home' } | { name: 'report'; mode: 'sighting' | 'stop' };

const DEFAULT_ROUTE: RouteId = ROUTES[0].id;

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [routeId, setRouteId] = useState<RouteId>(DEFAULT_ROUTE);

  return (
    <I18nProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.frame}>
        {screen.name === 'home' && (
          <HomeScreen
            routeId={routeId}
            onChangeRoute={setRouteId}
            onOpenReport={(mode) => setScreen({ name: 'report', mode })}
          />
        )}
        {screen.name === 'report' && (
          <ReportScreen
            routeId={routeId}
            mode={screen.mode}
            onCancel={() => setScreen({ name: 'home' })}
            onDone={() => setScreen({ name: 'home' })}
          />
        )}
        </View>
      </SafeAreaView>
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  frame: { flex: 1, overflow: 'hidden' },
});
