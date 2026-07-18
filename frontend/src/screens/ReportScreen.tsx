import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LatLng, RouteId } from '@/types';
import { routeById } from '@/data/routes';
import { colors, shadows } from '@/theme/colors';
import Map from '@/components/Map/Map';
import { AppHeader } from '@/components/AppHeader';
import { api } from '@/services/api';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useT } from '@/i18n/I18nContext';

type Mode = 'sighting' | 'stop';

type Props = {
  routeId: RouteId;
  mode: Mode;
  onDone: () => void;
  onCancel: () => void;
};

export const ReportScreen: React.FC<Props> = ({ routeId, mode, onDone, onCancel }) => {
  const route = routeById(routeId)!;
  const { location } = useUserLocation();
  const [tap, setTap] = useState<LatLng | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [sending, setSending] = useState(false);
  const t = useT();

  const isStop = mode === 'stop';
  const canSubmit = !!tap && (!isStop || nameEn.trim().length > 0);

  const submit = async () => {
    if (!tap || !canSubmit) return;
    setSending(true);
    if (isStop) {
      await api.suggestStop(routeId, {
        name: nameEn.trim(),
        nameAr: nameAr.trim() || nameEn.trim(),
        point: tap,
      });
    } else {
      await api.reportCoaster({
        routeId,
        point: tap,
        reportedAt: Date.now(),
      });
    }
    setSending(false);
    onDone();
  };

  const center = tap ?? location ?? route.path[Math.floor(route.path.length / 2)];

  return (
    <View style={styles.wrap}>
      <AppHeader
        title={isStop ? t.report.headerStop : t.report.headerSighting}
        onBack={onCancel}
      />
      <View style={{ flex: 1 }}>
        <Map
          center={center}
          zoom={14}
          route={route}
          coasters={
            !isStop && tap
              ? [
                  {
                    id: 'preview',
                    routeId,
                    position: tap,
                    headingDeg: 0,
                    speedKmh: 0,
                    updatedAt: Date.now(),
                    source: 'rider_report',
                  },
                ]
              : []
          }
          userLocation={location}
          onMapTap={setTap}
        />
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>
            {isStop ? t.report.whereStopTitle : t.report.whereSightingTitle}
          </Text>
          <Text style={styles.hintBody}>
            {isStop
              ? t.report.whereStopBody(route.nameEn)
              : t.report.whereSightingBody(route.nameEn)}
          </Text>
        </View>

        {isStop && tap && (
          <View style={styles.form}>
            <Text style={styles.formLabel}>{t.report.nameEnLabel}</Text>
            <TextInput
              value={nameEn}
              onChangeText={setNameEn}
              placeholder={t.report.nameEnPlaceholder}
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Text style={styles.formLabel}>{t.report.nameArLabel}</Text>
            <TextInput
              value={nameAr}
              onChangeText={setNameAr}
              placeholder={t.report.nameArPlaceholder}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { textAlign: 'right' }]}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={onCancel} style={[styles.btn, styles.btnGhost]}>
          <Text style={styles.btnGhostTxt}>{t.report.cancel}</Text>
        </Pressable>
        <Pressable
          onPress={submit}
          disabled={!canSubmit || sending}
          style={[styles.btn, styles.btnPrimary, (!canSubmit || sending) && { opacity: 0.5 }]}
        >
          <Text style={styles.btnPrimaryTxt}>
            {sending ? t.report.sending : isStop ? t.report.submitStop : t.report.submitSighting}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  hint: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 12,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    ...shadows.card,
  },
  hintTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  hintBody: { color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  form: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    ...shadows.card,
  },
  formLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryTxt: { color: '#fff', fontWeight: '600' },
  btnGhost: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  btnGhostTxt: { color: colors.text, fontWeight: '600' },
});
