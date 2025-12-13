import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('background');

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={accentColor}
      backgroundColor={backgroundColor}
      labelStyle={{
        fontSize: 11,
        fontWeight: '600',
        color: useThemeColor('foreground'),
      }}
      iconColor={{
        default: mutedColor,
        selected: accentColor,
      }}
    >
      {/* Report Tab */}
      <NativeTabs.Trigger name="report">
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>{t('tab.report')}</Label>
      </NativeTabs.Trigger>

      {/* Register Tab - Default landing page (first tab) */}
      <NativeTabs.Trigger name="register">
        <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} />
        <Label>{t('tab.register')}</Label>
      </NativeTabs.Trigger>

      {/* Settings Tab */}
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <Label>{t('tab.settings')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
