import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useAppTheme } from '@/ui/themes/app-theme-context';

export default function TabLayout() {
  const { isDark } = useAppTheme();
  const { t } = useTranslation();

  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('background');

  return (
    <NativeTabs
      tintColor={accentColor}
      backgroundColor={backgroundColor}
      blurEffect={
        isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'
      }
      labelStyle={{
        fontSize: 11,
        fontWeight: '600',
      }}
      iconColor={{
        default: mutedColor,
        selected: accentColor,
      }}
    >
      {/* Report Tab */}
      <NativeTabs.Trigger name="report">
        <Icon sf="chart.bar.doc.horizontal" />
        <Label>{t('tab.report')}</Label>
      </NativeTabs.Trigger>

      {/* Register Tab - Default landing page (first tab) */}
      <NativeTabs.Trigger name="register">
        <View testID="screen.tabs.register.icon">
          <Icon sf="plus.circle.fill" />
        </View>
        <Label>{t('tab.register')}</Label>
      </NativeTabs.Trigger>

      {/* Settings Tab */}
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" />
        <Label>{t('tab.settings')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
