import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, useThemeColor } from 'heroui-native';
import { Image, Pressable, Text, View } from 'react-native';

export default function Welcome1Screen() {
  const router = useRouter();
  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const handleSkip = () => {
    router.push('/select-role');
  };

  const handleNext = () => {
    router.push('/(onboarding)/welcome-2');
  };

  return (
    <View style={{ backgroundColor, flex: 1 }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <View className="w-8" />
        <Image
          source={require('@/assets/logo-light.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
        <Pressable onPress={handleSkip}>
          <Text style={{ color: mutedColor }} className="text-base">
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Illustration Placeholder */}
        <View className="bg-[#C8CAE5] rounded-full w-64 h-64 mb-12 items-center justify-center">
          <View className="bg-[#9B9FC5] rounded-full w-48 h-48 items-center justify-center">
            <Ionicons name="heart" size={80} color="#7B7FA5" />
          </View>
        </View>

        {/* Title and Description */}
        <Text
          style={{ color: foregroundColor }}
          className="text-2xl font-bold text-center mb-4"
        >
          Te ayudamos a cuidar con tranquilidad.
        </Text>

        <Text
          style={{ color: mutedColor }}
          className="text-base text-center leading-6"
        >
          Registra cateterismos y rutinas de forma rápida, clara y sin conexión.
        </Text>
      </View>

      {/* Footer with Pagination and Next Button */}
      <View className="px-8 pb-12 gap-6">
        {/* Pagination Dots */}
        <View className="flex-row items-center justify-center gap-2">
          <View
            style={{ backgroundColor: accentColor }}
            className="w-8 h-2 rounded-full"
          />
          <View
            style={{ backgroundColor: mutedColor, opacity: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
          <View
            style={{ backgroundColor: mutedColor, opacity: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
        </View>

        {/* Next Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleNext}
          className="rounded-full"
          isIconOnly
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </Button>
      </View>
    </View>
  );
}
