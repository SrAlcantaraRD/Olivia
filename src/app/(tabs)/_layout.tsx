import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from 'heroui-native';

import { useAppTheme } from '@/ui/themes/app-theme-context';

export default function TabLayout() {
  const { isDark } = useAppTheme();

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
      <NativeTabs.Trigger name="home">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      {/* Hidden tab - navigation handled by FloatingAddButton */}
      <NativeTabs.Trigger name="add" hidden>
        <Icon sf="plus.app.fill" />
        <Label>Add</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Icon sf="chart.bar.fill" />
        <Label>Stats</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="design-system">
        <Icon sf="paintbrush.fill" />
        <Label>Design System</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
