import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { useI18n } from '@/i18n/I18nContext';

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useI18n();
  return (
    <Pressable
      onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
      style={styles.wrap}
    >
      <Text style={[styles.txt, lang === 'en' && styles.active]}>EN</Text>
      <Text style={styles.divider}>·</Text>
      <Text style={[styles.txt, lang === 'ar' && styles.active]}>AR</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txt: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  active: { color: colors.primary },
  divider: { color: colors.border, fontSize: 11 },
});
