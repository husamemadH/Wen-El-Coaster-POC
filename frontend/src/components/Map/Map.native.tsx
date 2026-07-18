import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import type { MapProps } from './types';

/**
 * Native placeholder. Ship-ready implementation would use `react-native-maps`
 * with a Google Maps provider on Android and Apple Maps / Google Maps on iOS,
 * mirroring the marker/polyline layout from Map.web.tsx.
 */
const NativeMap: React.FC<MapProps> = () => (
  <View style={styles.wrap}>
    <Text style={styles.title}>Native map not wired up in this POC</Text>
    <Text style={styles.body}>
      Run this project with `npm run web` to see the map. On device we would drop in
      react-native-maps here.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.bg,
  },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  body: { textAlign: 'center', color: colors.textMuted },
});

export default NativeMap;
