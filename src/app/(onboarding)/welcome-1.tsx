import { useRouter } from 'expo-router';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenScrollView } from '@/ui/components/screen-scroll-view.atom';

export default function Onboarding1Screen() {
  const router = useRouter();

  return (
    <ScreenScrollView>
      <TypographyTitle>Welcome-1</TypographyTitle>
      <ButtonAtom
        title="welcome"
        onPress={() => router.push('/(onboarding)/welcome-2')}
      />
    </ScreenScrollView>
  );
}
