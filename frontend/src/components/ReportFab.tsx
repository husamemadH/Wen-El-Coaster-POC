import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '@/theme/colors';
import { useT } from '@/i18n/I18nContext';

type Props = { onPress: () => void };

export const ReportFab: React.FC<Props> = ({ onPress }) => {
  const t = useT();
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.icon}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>＋</Text>
      </View>
      <Text style={styles.label}>{t.fabs.seeCoaster}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 12,
    bottom: 24,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingLeft: 4,
    paddingRight: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadows.card,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: colors.text, fontWeight: '600' },
});
