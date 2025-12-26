import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useActiveCarer } from '@/domain/carer/hook/use-active-carer.hook';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { useGenerateRecordSynchronizationQr } from '@/domain/core/hook/use-generate-record-synchronization-qr.hook';
import { QRCodeViewer } from '@/ui/components/atoms/qr-code-viewer.atom';
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
  const { carer } = useActiveCarer(adapters);

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
            <View className="flex-1 items-center justify-center p-4">
              {/* Loading is handled by ScreenLayout */}
            </View>
          ),
        },
      ];
    }

    return items.chunkList.map((chunk, index) => ({
      id: `chunk-${index}`,
      isValid: true,
      content: (
        <ScreenLayout
          testID={`sync-records.chunk-${index}.desc`}
          title="page.settings.synchronization.collection.progress"
          subtitle="page.settings.sync-records-desc"
          values={{ total: chunk[QR_KEY.CHUNK_TOTAL], count: index + 1 }}
          styles={{
            container: 'p-0',
          }}
        >
          <QRCodeViewer data={JSON.stringify(chunk)} />
        </ScreenLayout>
      ),
    }));
  }, [items]);

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
    <ScreenLayout testID="sync-records.screen" isLoading={isExecuting}>
      <Wizard
        steps={steps}
        currentStepIndex={currentStepIndex}
        onNext={handleNext}
        onBack={handleBack}
        testID="sync-records.wizard"
      />
    </ScreenLayout>
  );
}
