import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');

  useEffect(() => {
    // Auto-navigate to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.push('/(onboarding)');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View
      style={{ backgroundColor, flex: 1 }}
      className="flex-1 items-center justify-center px-6"
    >
      {/* Logo Section */}
      <View className="items-center mb-16">
        <View className="bg-[#9B9FC5] rounded-4xl p-12 mb-8 items-center justify-center w-48 h-48">
          <Image
            source={require('@/assets/splash-icon.png')}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{ color: foregroundColor }}
          className="text-4xl font-bold mb-2"
        >
          Oliva
        </Text>

        <Text style={{ color: mutedColor }} className="text-lg text-center">
          Cuidar. Registrar. Respirar.
        </Text>
      </View>

      {/* Privacy Notice */}
      <View className="absolute bottom-12 items-center flex-row gap-2 px-6">
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={mutedColor}
        />
        <Text style={{ color: mutedColor }} className="text-sm text-center">
          Tus datos se guardan solo en tu móvil
        </Text>
      </View>
    </View>
  );
}
