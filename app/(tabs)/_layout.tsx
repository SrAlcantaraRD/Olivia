import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <NativeTabs
      tintColor={tintColor}
      backgroundColor={null}
      blurEffect={
        isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'
      }
      labelStyle={{
        fontSize: 11,
        fontWeight: '600',
      }}
      iconColor={{
        default: isDark ? '#8E8E93' : '#8E8E93',
        selected: tintColor,
      }}
    >
      <NativeTabs.Trigger name="index">
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
    </NativeTabs>
  );
}
