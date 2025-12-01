import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/ui/themes/app-theme-context';

export default function TabLayout() {
  const { isDark } = useAppTheme();
  const { t } = useTranslation();

  const themeColorForeground = useThemeColor('foreground');
  const themeColorBackground = useThemeColor('background');

  return (
    <NativeTabs
      tintColor={themeColorForeground}
      backgroundColor={themeColorBackground}
      blurEffect={
        isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'
      }
      labelStyle={{
        fontSize: 11,
        fontWeight: '600',
      }}
      iconColor={{
        default: isDark ? '#8E8E93' : '#8E8E93',
        selected: themeColorForeground,
      }}
    >
      {/* Register Tab - Default landing page */}
      <NativeTabs.Trigger name="register">
        <Icon sf="plus.circle.fill" />
        <Label>{t('tab.register')}</Label>
      </NativeTabs.Trigger>

      {/* Report Tab */}
      <NativeTabs.Trigger name="report">
        <Icon sf="chart.bar.doc.horizontal" />
        <Label>{t('tab.report')}</Label>
      </NativeTabs.Trigger>

      {/* Settings Tab */}
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" />
        <Label>{t('tab.settings')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
