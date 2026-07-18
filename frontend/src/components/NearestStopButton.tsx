import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, shadows } from '@/theme/colors';
import { useT } from '@/i18n/I18nContext';

type Props = { onPress: () => void };

export const NearestStopButton: React.FC<Props> = ({ onPress }) => {
  const t = useT();
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <Text style={styles.icon}>🎯</Text>
      <Text style={styles.label}>{t.fabs.nearestStop}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    bottom: 24,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadows.card,
  },
  icon: { fontSize: 16 },
  label: { color: colors.text, fontWeight: '600', fontSize: 13 },
});
