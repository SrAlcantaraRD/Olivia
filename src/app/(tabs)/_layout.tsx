import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { t } = useTranslation();

  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('surface');
  const foregroundColor = useThemeColor('foreground');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: mutedColor,
        tabBarStyle: {
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: backgroundColor,
          }),
          position: Platform.select({
            ios: 'absolute',
            android: 'relative',
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.select({
            ios: 88,
            android: 64,
          }),
          paddingBottom: Platform.select({
            ios: 32,
            android: 12,
          }),
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="systemChromeMaterial"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="report"
        options={{
          title: t('tab.report'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: t('tab.summary'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'reader' : 'reader-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: t('tab.register'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab.settings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
