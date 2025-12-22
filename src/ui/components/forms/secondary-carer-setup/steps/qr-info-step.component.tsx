import { format } from 'date-fns';
import { View } from 'react-native';

import { useSecondaryCarerSetupStore } from '@/domain/core/stores/secondary-carer-setup.store';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';

interface QRInfoStepProps {
  testID: string;
}

export function QRInfoStep({ testID }: QRInfoStepProps) {
  const { formData } = useSecondaryCarerSetupStore();
  const qrData = formData.qrData;

  if (!qrData || !qrData.payload) {
    return (
      <View className="flex-1 items-center justify-center">
        <TypographyParagraph
          i18nKey="common.loading"
          testID={`${testID}.loading`}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-4">
      <TypographyParagraph
        testID={`${testID}.user-name`}
        i18nKey="secondary-carer-setup.qr-info.user-name"
        values={{ userName: qrData.payload.name }}
      />
      <TypographyParagraph
        testID={`${testID}.expires-at`}
        i18nKey="secondary-carer-setup.qr-info.expires-at"
        values={{ expiresAt: format(qrData.payload.expiresAt, 'yyyy-MM-dd') }}
      />

      <TypographySmall
        variant="light"
        size="xs"
        className="opacity-30"
        testID={`${testID}.invitation-details`}
        i18nKey="common.raw-value"
        values={{ value: JSON.stringify(qrData) }}
      />
    </View>
  );
}
