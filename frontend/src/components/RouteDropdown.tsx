import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Route, RouteId } from '@/types';
import { colors, shadows } from '@/theme/colors';
import { useT } from '@/i18n/I18nContext';

type Props = {
  routes: Route[];
  selectedId: RouteId;
  onSelect: (id: RouteId) => void;
};

export const RouteDropdown: React.FC<Props> = ({ routes, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const selected = routes.find((r) => r.id === selectedId)!;

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.trigger}>
        <View style={[styles.dot, { backgroundColor: selected.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{t.dropdown.track}</Text>
          <Text style={styles.name}>{selected.nameEn}</Text>
          <Text style={styles.nameAr}>{selected.nameAr}</Text>
        </View>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>▾</Text>
      </Pressable>

      {open && (
        <>
          <Pressable style={styles.scrim} onPress={() => setOpen(false)} />
          <View style={styles.menu}>
            {routes.map((r, i) => {
              const isSelected = r.id === selectedId;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => {
                    onSelect(r.id);
                    setOpen(false);
                  }}
                  style={({ hovered }: any) => [
                    styles.item,
                    i > 0 && styles.itemBorder,
                    hovered && { backgroundColor: colors.bg },
                  ]}
                >
                  <View style={[styles.itemDot, { backgroundColor: r.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, isSelected && { color: r.color }]}>
                      {r.nameEn}
                    </Text>
                    <Text style={styles.itemAr}>{r.nameAr}</Text>
                  </View>
                  {isSelected && <Text style={[styles.check, { color: r.color }]}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'relative', zIndex: 1001 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  nameAr: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  chevron: {
    fontSize: 18,
    color: colors.textMuted,
    paddingHorizontal: 6,
  },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  scrim: {
    position: 'absolute',
    left: -9999,
    right: -9999,
    top: -9999,
    bottom: -9999,
  },
  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 52,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  itemDot: { width: 10, height: 10, borderRadius: 5 },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemAr: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  check: { fontSize: 16, fontWeight: '700' },
});
