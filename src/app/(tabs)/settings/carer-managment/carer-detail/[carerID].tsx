import { ScrollView } from 'react-native';

import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function CarerDetailScreen() {
  // const params = useLocalSearchParams<{ carerID?: string }>();
  // const carerID = Number(params.carerID ?? 0);

  return (
    <ScreenLayout
      title="page.carer-detail.title"
      subtitle="page.carer-detail.subtitle"
      testID="screen.settings.carer-detail"
    >
      <ScrollView
        className="flex-1 px-4 space-y-4"
        contentContainerStyle={{ paddingVertical: 12 }}
      >
        <CardAtom className="p-4 space-y-3">
          <TypographyTitle
            testID="carer-detail.heading"
            i18nKey="page.carer-detail.heading"
          />
          <ButtonAtom
            title="page.carer-detail.analysis-button"
            testID="carer-detail.analysis"
            onPress={() => {}}
            isDisabled
          />
        </CardAtom>
      </ScrollView>
    </ScreenLayout>
  );
}
