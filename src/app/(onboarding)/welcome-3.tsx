import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenScrollView } from '@/ui/components/screen-scroll-view.atom';

export default function Onboarding3Screen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  return (
    <ScreenScrollView
      className="flex-1"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 12 }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TypographyTitle>Welcome-3</TypographyTitle>
        <ButtonAtom
          title="finish"
          onPress={() => router.push('/select-role')}
        />
      </View>
    </ScreenScrollView>
  );
}
