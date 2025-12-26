import { format } from 'date-fns';
import { View } from 'react-native';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import { ModuleCard } from '@/ui/components/cards/module.card';
import { useSecondaryCarerSetupForm } from '@/ui/components/forms/secondary-carer-setup/use-secondary-carer-setup-form.hook';

interface QRInfoStepProps {
  testID: string;
}

export function QRInfoStep({ testID }: QRInfoStepProps) {
  const { formData, activeModules } = useSecondaryCarerSetupForm();
  const qrData = formData.qrData;

  if (!qrData || !qrData[QR_KEY.PAYLOAD]) {
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
        values={{ userName: qrData[QR_KEY.PAYLOAD][QR_KEY.ORIGIN_CARER_NAME] }}
      />
      <TypographyParagraph
        testID={`${testID}.expires-at`}
        i18nKey="secondary-carer-setup.qr-info.expires-at"
        values={{
          expiresAt: format(
            qrData[QR_KEY.PAYLOAD][QR_KEY.ORIGIN_CARER_EXPIRES_AT],
            'yyyy-MM-dd'
          ),
        }}
      />

      <TypographyParagraph
        testID={`${testID}.active-actions-title`}
        i18nKey="secondary-carer-setup.modules.title"
        variant="primary"
        weight="semibold"
        size="lg"
      />

      {/* Active Actions */}
      <View className="gap-4">
        {activeModules.map((module) => (
          <ModuleCard
            testID={`page.register.module-card.${module.code}`}
            key={module.id}
            module={module}
            onPress={() => {}}
          />
        ))}
      </View>

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
