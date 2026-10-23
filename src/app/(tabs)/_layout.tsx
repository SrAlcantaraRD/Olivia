import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { type MaterialTopTabBarProps, TopTabs } from 'expo-router/js-top-tabs';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  type EdgeInsets,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// expo-router v4+ key: land on the register tab when entering (tabs),
// preserving the intent previously declared in the root layout.
export const unstable_settings = {
  anchor: 'register',
};

interface CustomTabBarProps extends MaterialTopTabBarProps {
  accentColor: string;
  mutedColor: string;
  backgroundColor: string;
  insets: EdgeInsets;
}

function CustomTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  accentColor,
  mutedColor,
  backgroundColor,
  insets,
}: CustomTabBarProps) {
  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: Platform.select({
            ios: 64 + insets.bottom,
            android: 64 + insets.bottom * 1.3,
          }),
          paddingBottom: insets.bottom,
          backgroundColor:
            Platform.OS === 'android' ? backgroundColor : 'transparent',
        },
      ]}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={80}
          tint="systemChromeMaterial"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {options.tabBarIcon?.({
                color: isFocused ? accentColor : mutedColor,
                focused: isFocused,
              })}
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? accentColor : mutedColor },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('surface');
  const insets = useSafeAreaInsets();

  return (
    <TopTabs
      tabBarPosition="bottom"
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          accentColor={accentColor}
          mutedColor={mutedColor}
          backgroundColor={backgroundColor}
          insets={insets}
        />
      )}
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
        lazyPreloadDistance: 1,
        animationEnabled: true,
      }}
    >
      <TopTabs.Screen
        name="summary"
        options={{
          title: t('tab.summary'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'reader' : 'reader-outline'}
              size={24}
              color={focused ? accentColor : mutedColor}
            />
          ),
        }}
      />
      <TopTabs.Screen
        name="register"
        options={{
          title: t('tab.register'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={28}
              color={focused ? accentColor : mutedColor}
            />
          ),
        }}
      />
      <TopTabs.Screen
        name="settings"
        options={{
          title: t('tab.settings'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={24}
              color={focused ? accentColor : mutedColor}
            />
          ),
        }}
      />
    </TopTabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
