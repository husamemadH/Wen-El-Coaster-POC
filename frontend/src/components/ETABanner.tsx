import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Coaster, Eta, Route, RouteId } from '@/types';
import { colors, shadows } from '@/theme/colors';
import { Walk, formatDistance, formatEta } from '@/services/eta';
import { RouteDropdown } from './RouteDropdown';
import { LanguageToggle } from './LanguageToggle';
import { useI18n } from '@/i18n/I18nContext';

export type QueueItem = { coaster: Coaster; eta: Eta };

type Props = {
  routes: Route[];
  selectedId: RouteId;
  onSelect: (id: RouteId) => void;
  selectedStop?: { name: string; nameAr: string; pending?: boolean };
  onClearStop?: () => void;
  onConfirmStop?: () => void;
  queue: QueueItem[];
  walk?: Walk | null;
};

export const ETABanner: React.FC<Props> = ({
  routes,
  selectedId,
  onSelect,
  selectedStop,
  onClearStop,
  onConfirmStop,
  queue,
  walk,
}) => {
  const { t, lang } = useI18n();
  const hasStop = !!selectedStop;
  const isPending = !!selectedStop?.pending;
  const [next, ...rest] = queue;
  const hasCoaster = hasStop && !isPending && !!next;

  const sourceLabel = (c: Coaster) =>
    c.source === 'rider_report' ? t.banner.riderReport : t.banner.plate(c.plate ?? '—');

  const confidenceLabel = (c: Eta['confidence']) =>
    c === 'high' ? t.banner.confHigh : c === 'medium' ? t.banner.confMedium : t.banner.confLow;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <RouteDropdown routes={routes} selectedId={selectedId} onSelect={onSelect} />
        </View>
        <LanguageToggle />
      </View>

      <View style={styles.divider} />

      {!hasStop && (
        <View>
          <Text style={styles.headline}>{t.banner.tapStopTitle}</Text>
          <Text style={styles.sub}>{t.banner.tapStopHint}</Text>
        </View>
      )}

      {hasStop && (
        <View>
          <View style={styles.stopRow}>
            <Text style={styles.stopLabel}>{t.banner.stop}</Text>
            {onClearStop && (
              <Pressable onPress={onClearStop} hitSlop={8}>
                <Text style={styles.clearBtn}>{t.banner.clear}</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.stopNameRow}>
            <Text style={styles.stopName}>{selectedStop.name}</Text>
            {isPending && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeTxt}>{t.banner.pending}</Text>
              </View>
            )}
          </View>
          <Text style={styles.stopAr}>{selectedStop.nameAr}</Text>

          {walk && (
            <View style={styles.walkRow}>
              <Text style={styles.walkIcon}>🚶</Text>
              <Text style={styles.walkTxt}>
                {t.banner.walkFromYou(
                  formatEta(walk.seconds, lang),
                  formatDistance(walk.distanceMeters, lang),
                )}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {isPending && (
            <View>
              <Text style={styles.headline}>{t.banner.awaitingConfirmation}</Text>
              <Text style={styles.sub}>{t.banner.awaitingHint}</Text>
              {onConfirmStop && (
                <Pressable onPress={onConfirmStop} style={styles.confirmBtn}>
                  <Text style={styles.confirmBtnTxt}>{t.banner.confirmButton}</Text>
                </Pressable>
              )}
            </View>
          )}

          {!isPending && hasCoaster && (
            <View>
              <Text style={styles.headline}>
                {t.banner.coasterInPrefix}
                <Text style={{ color: colors.primary }}>
                  {formatEta(next.eta.seconds, lang)}
                </Text>
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>
                  {t.banner.away(formatDistance(next.eta.distanceMeters, lang))}
                </Text>
                <View style={styles.metaDot} />
                <Text style={styles.meta}>{sourceLabel(next.coaster)}</Text>
                <View style={styles.metaDot} />
                <Text style={[styles.meta, { color: confidenceColor(next.eta.confidence) }]}>
                  {confidenceLabel(next.eta.confidence)}
                </Text>
              </View>

              {rest.length > 0 && (
                <View style={styles.queueBox}>
                  <Text style={styles.queueLabel}>{t.banner.thenLabel}</Text>
                  {rest.slice(0, 3).map((item) => (
                    <View key={item.coaster.id} style={styles.queueRow}>
                      <Text style={styles.queueEta}>{formatEta(item.eta.seconds, lang)}</Text>
                      <View style={styles.metaDot} />
                      <Text style={styles.queueSub}>
                        {formatDistance(item.eta.distanceMeters, lang)} ·{' '}
                        {sourceLabel(item.coaster)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {!isPending && !hasCoaster && (
            <View>
              <Text style={styles.headline}>{t.banner.noCoaster}</Text>
              <Text style={styles.sub}>{t.banner.noCoasterHint}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const confidenceColor = (c: Eta['confidence']) =>
  c === 'high' ? colors.success : c === 'medium' ? colors.warning : colors.textMuted;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 12,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    position: 'relative',
    zIndex: 1002,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  headline: { fontSize: 18, fontWeight: '600', color: colors.text },
  sub: { color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  stopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  stopName: { fontSize: 15, fontWeight: '600', color: colors.text },
  stopAr: { fontSize: 12, color: colors.textMuted },
  pendingBadge: {
    backgroundColor: colors.warning + '22',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingBadgeTxt: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  clearBtn: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  walkRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  walkIcon: { fontSize: 14 },
  walkTxt: { color: colors.text, fontSize: 13, flex: 1 },
  confirmBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  meta: { color: colors.textMuted, fontSize: 13 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.border },
  queueBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  queueLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  queueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  queueEta: { fontSize: 14, fontWeight: '600', color: colors.text, minWidth: 56 },
  queueSub: { color: colors.textMuted, fontSize: 12 },
});
