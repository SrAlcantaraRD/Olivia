import { useThemeColor } from 'heroui-native';
import { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { useAdapters } from '@/adapter';
import { useActiveCarer } from '@/domain/carer/hook/use-active-carer.hook';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { useGenerateRecordSynchronizationQr } from '@/domain/core/hook/use-generate-record-synchronization-qr.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import {
  Wizard,
  type WizardStep,
} from '@/ui/components/molecules/wizard.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SynchronizeRecordsScreen() {
  const adapters = useAdapters();
  const { navigationAdapter } = adapters;
  const { goBack } = useNavigation({ navigationAdapter });
  const accentColor = useThemeColor('accent');
  const { carer } = useActiveCarer(adapters);
  const { width: windowWidth } = useWindowDimensions();

  const {
    execute: generateQr,
    isExecuting,
    items,
  } = useGenerateRecordSynchronizationQr(adapters);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (carer?.id) {
      generateQr({ carerID: carer.id });
    }
  }, [carer?.id, generateQr]);

  const steps: WizardStep[] = useMemo(() => {
    if (!items || items.chunkList.length === 0) {
      return [
        {
          id: 'loading',
          isValid: false,
          content: (
            <ScreenLayout
              title="page.settings.sync-records"
              subtitle="page.settings.sync-records-desc"
              isLoading={isExecuting}
              testID="sync-records.loading"
              styles={{
                container: 'p-0',
              }}
            >
              <View />
            </ScreenLayout>
          ),
        },
      ];
    }

    return items.chunkList.map((chunk, index) => ({
      id: `chunk-${index}`,
      isValid: true,
      content: (
        <ScreenLayout
          title="page.settings.sync-records"
          subtitle="page.settings.sync-records-desc"
          testID={`sync-records.chunk-${index}`}
        >
          <View className="items-center justify-center">
            <QRCode
              size={windowWidth * 0.9}
              value={chunk[QR_KEY.CHUNK_DATA]}
              color={accentColor}
            />
            <View className="mt-8">
              {/* Optional: Add text indicating chunk X of Y */}
            </View>
          </View>
        </ScreenLayout>
      ),
    }));
  }, [items, isExecuting, accentColor]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      goBack();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      goBack();
    }
  };

  return (
    <Wizard
      steps={steps}
      currentStepIndex={currentStepIndex}
      onNext={handleNext}
      onBack={handleBack}
      testID="sync-records.wizard"
    />
  );
}
