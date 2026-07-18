import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '@/theme/colors';
import { useT } from '@/i18n/I18nContext';

type Props = { onPress: () => void };

export const SuggestStopFab: React.FC<Props> = ({ onPress }) => {
  const t = useT();
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.icon}>
        <Text style={{ fontSize: 16 }}>🚏</Text>
      </View>
      <Text style={styles.label}>{t.fabs.suggestStop}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 12,
    bottom: 84,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadows.card,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.text, fontWeight: '600', fontSize: 13 },
});
