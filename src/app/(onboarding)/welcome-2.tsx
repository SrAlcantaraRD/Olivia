import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, useThemeColor } from 'heroui-native';
import { Image, Pressable, Text, View } from 'react-native';

export default function Welcome2Screen() {
  const router = useRouter();
  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');

  const handleSkip = () => {
    router.push('/select-role');
  };

  const handleNext = () => {
    router.push('/(onboarding)/welcome-3');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ backgroundColor, flex: 1 }} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <Pressable onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={foregroundColor} />
        </Pressable>
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
          <View className="bg-[#9B9FC5] rounded-3xl p-8 items-center justify-center">
            <Ionicons name="time-outline" size={60} color="#7B7FA5" />
            <Ionicons
              name="checkmark-done-outline"
              size={40}
              color="#7B7FA5"
              style={{ position: 'absolute', bottom: 10, right: 10 }}
            />
          </View>
        </View>

        {/* Title and Description */}
        <Text
          style={{ color: foregroundColor }}
          className="text-2xl font-bold text-center mb-6"
        >
          Rápido. Guiado. Pensado para tu día a día.
        </Text>

        {/* Bullet Points */}
        <View className="gap-3 w-full">
          {[
            'Registro en segundos',
            'Un paso cada vez',
            'Perfecto para rutinas con prisas',
          ].map((item) => (
            <View key={item} className="flex-row items-center gap-3">
              <View
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              <Text style={{ color: mutedColor }} className="text-base">
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer with Pagination and Next Button */}
      <View className="px-8 pb-12 gap-6">
        {/* Pagination Dots */}
        <View className="flex-row items-center justify-center gap-2">
          <View
            style={{ backgroundColor: mutedColor, opacity: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
          <View
            style={{ backgroundColor: accentColor }}
            className="w-8 h-2 rounded-full"
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
