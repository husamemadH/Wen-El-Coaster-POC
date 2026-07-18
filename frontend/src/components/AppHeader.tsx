import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '@/theme/colors';

type Props = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export const AppHeader: React.FC<Props> = ({ title, onBack, right }) => (
  <View style={styles.wrap}>
    {onBack ? (
      <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
        <Text style={styles.backTxt}>‹</Text>
      </Pressable>
    ) : (
      <View style={{ width: 32 }} />
    )}
    <Text style={styles.title}>{title}</Text>
    <View style={{ width: 32, alignItems: 'flex-end' }}>{right}</View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.card,
  },
  back: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTxt: { fontSize: 28, color: colors.text, lineHeight: 30, marginTop: -4 },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
});
