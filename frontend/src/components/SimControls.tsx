import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SimConfig, TimeOfDay } from '@/types';
import { colors, shadows } from '@/theme/colors';
import { useT } from '@/i18n/I18nContext';

type Props = {
  value: SimConfig;
  onChange: (next: SimConfig) => void;
};

export const SimControls: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const t = useT();

  const times: Array<{ id: TimeOfDay; label: string }> = [
    { id: 'morning_rush', label: t.sim.morningRush },
    { id: 'midday', label: t.sim.midday },
    { id: 'evening', label: t.sim.evening },
    { id: 'night', label: t.sim.night },
  ];

  return (
    <View style={styles.container} pointerEvents="box-none">
      {open && (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.badge}>{t.sim.pocBadge}</Text>
            <Text style={styles.panelTitle}>{t.sim.title}</Text>
          </View>
          <Text style={styles.hint}>{t.sim.hint}</Text>

          <Text style={styles.groupLabel}>{t.sim.timeOfDay}</Text>
          <View style={styles.chipRow}>
            {times.map((opt) => {
              const selected = value.timeOfDay === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => onChange({ ...value, timeOfDay: opt.id })}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipTxt, selected && styles.chipTxtSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => onChange({ ...value, rain: !value.rain })}
            style={styles.toggleRow}
          >
            <View style={[styles.checkbox, value.rain && styles.checkboxOn]}>
              {value.rain && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.toggleLabel}>{t.sim.rainy}</Text>
            <Text style={styles.toggleSub}>{t.sim.rainSub}</Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={() => setOpen((v) => !v)} style={styles.trigger}>
        <Text style={styles.triggerIcon}>🧪</Text>
        <Text style={styles.triggerLabel}>{t.sim.chip}</Text>
        <Text style={styles.triggerChevron}>{open ? '▾' : '▴'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 999,
  },
  trigger: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  triggerIcon: { fontSize: 14 },
  triggerLabel: { color: colors.textMuted, fontWeight: '600', fontSize: 12 },
  triggerChevron: { color: colors.textMuted, fontSize: 12 },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    width: 320,
    maxWidth: '90%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
    ...shadows.card,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    backgroundColor: colors.text,
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  panelTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  groupLabel: {
    marginTop: 12,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.text, fontSize: 12, fontWeight: '600' },
  chipTxtSelected: { color: '#fff' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxTick: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: -2 },
  toggleLabel: { color: colors.text, fontWeight: '600', fontSize: 13 },
  toggleSub: { color: colors.textMuted, fontSize: 12 },
});
