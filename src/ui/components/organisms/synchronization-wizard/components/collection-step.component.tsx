import { View } from 'react-native';

import type { TQRChunk } from '@/domain/core/dto/qr.dto';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { ScanQRStep } from '@/ui/components/forms/secondary-carer-setup/steps/scan-qr-step.component';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

interface CollectionStepProps {
  handleReadQR: (scannedData: string) => void;
  collectedCount: number;
  totalChunks: number | null;
  collectedChunks: Record<number, TQRChunk>;
}

export function CollectionStep({
  handleReadQR,
  collectedCount,
  totalChunks,
  collectedChunks,
}: CollectionStepProps) {
  return (
    <ScreenLayout
      testID="generate-invitation-qr.ttl-selection"
      title="hook.consume-sync-qr.title"
      subtitle={
        totalChunks !== null
          ? 'page.settings.synchronization.collection.progress'
          : 'page.settings.synchronization.collection.start'
      }
      values={{ count: collectedCount, total: totalChunks || 0 }}
      styles={{
        container: 'p-0',
      }}
    >
      <ScanQRStep
        onReadQR={handleReadQR}
        testID="screen.settings.synchronization.scanner"
      />

      {totalChunks !== null && (
        <View className="flex-row flex-wrap justify-center gap-2 pt-5">
          {Array.from({ length: totalChunks }).map((_, i) => {
            const index = i + 1;
            const isCollected = !!collectedChunks[index];
            return (
              <View
                key={index}
                className={`w-8 h-8 rounded-md items-center justify-center ${
                  isCollected ? 'bg-accent' : 'bg-muted/20'
                }`}
              >
                <TypographyParagraph
                  i18nKey="common.raw-value"
                  values={{ value: index.toString() }}
                  className={`text-xs font-bold ${
                    isCollected ? 'text-white' : 'text-muted'
                  }`}
                  testID={`sync.chunk.idx-${index}`}
                />
              </View>
            );
          })}
        </View>
      )}
    </ScreenLayout>
  );
}
