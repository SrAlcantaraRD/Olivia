import { useRouter } from 'expo-router';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenScrollView } from '@/ui/components/screen-scroll-view.atom';

export default function Onboarding2Screen() {
  const router = useRouter();

  return (
    <ScreenScrollView>
      <TypographyTitle>Welcome-2</TypographyTitle>
      <ButtonAtom
        title="next"
        onPress={() => router.push('/(onboarding)/welcome-3')}
      />
    </ScreenScrollView>
  );
}
