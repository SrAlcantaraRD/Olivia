import { useCallback, useEffect, useState } from 'react';

import { useAdapters } from '@/adapter';
import type { TQRChunk } from '@/domain/core/dto/qr.dto';
import type { TRecordSyncBundle } from '@/domain/core/dto/sync-record.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { useConsumeRecordSynchronizationQr } from '@/domain/core/hook/use-consume-record-synchronization-qr.hook';

export type TSynchronizationSummary = {
  count: number;
  startDate: Date;
  endDate: Date;
};

export function useSynchronizationWizard() {
  const adapters = useAdapters();
  const { execute: consumeQr, isExecuting: isExecutingConsume } =
    useConsumeRecordSynchronizationQr(adapters);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [collectedChunks, setCollectedChunks] = useState<
    Record<number, TQRChunk>
  >({});
  const [totalChunks, setTotalChunks] = useState<number | null>(null);
  const [bundleID, setBundleID] = useState<string | null>(null);

  const [summary, setSummary] = useState<TSynchronizationSummary>({
    count: 0,
    startDate: new Date(),
    endDate: new Date(),
  });
  const [isDecoding, setIsDecoding] = useState(false);

  const handleReadQR = useCallback(
    (scannedData: string) => {
      try {
        const chunk: TQRChunk = JSON.parse(scannedData);
        const {
          [QR_KEY.CHUNK_INDEX]: index,
          [QR_KEY.CHUNK_TOTAL]: total,
          [QR_KEY.BUNDLE_ID]: id,
        } = chunk;

        if (bundleID && id !== bundleID) {
          return;
        }

        if (!bundleID) {
          setBundleID(id);
          setTotalChunks(total);
        }

        setCollectedChunks((prev) => ({
          ...prev,
          [index]: chunk,
        }));
      } catch {
        // Not a valid chunk
      }
    },
    [bundleID]
  );

  const collectedCount = Object.keys(collectedChunks).length;
  const isCollectionComplete =
    totalChunks !== null && collectedCount === totalChunks;

  useEffect(() => {
    async function decodeBundle() {
      if (!isCollectionComplete || summary) return;

      setIsDecoding(true);
      try {
        const sortedChunks = Object.values(collectedChunks).sort(
          (a, b) => a[QR_KEY.CHUNK_INDEX] - b[QR_KEY.CHUNK_INDEX]
        );

        const base64 = sortedChunks.map((c) => c[QR_KEY.CHUNK_DATA]).join('');
        const bundle =
          await adapters.qrAdapter.unpackBundle<TRecordSyncBundle>(base64);

        const records = bundle[QR_KEY.PAYLOAD][QR_KEY.RECORDS];
        if (records.length > 0) {
          const dates = records.map((r) => Number(r[QR_KEY.RECORD_DATE]));
          setSummary({
            count: records.length,
            startDate: new Date(Math.min(...dates)),
            endDate: new Date(Math.max(...dates)),
          });
        }
      } catch (error) {
        adapters.loggerAdapter.error(
          'useSynchronizationWizard.decodeBundle',
          error
        );
      } finally {
        setIsDecoding(false);
      }
    }

    decodeBundle();
  }, [
    isCollectionComplete,
    collectedChunks,
    adapters.qrAdapter,
    summary,
    adapters.loggerAdapter,
  ]);

  const handleNext = async (stepsLength: number) => {
    if (currentStepIndex === stepsLength - 1) {
      const resp = await consumeQr({
        chunkList: Object.values(collectedChunks),
      });

      if (resp.success) {
        adapters.navigationAdapter.goBack();
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return {
    currentStepIndex,
    collectedChunks,
    totalChunks,
    collectedCount,
    isCollectionComplete,
    summary,
    isDecoding,
    isExecutingConsume,
    handleReadQR,
    handleNext,
    handleBack,
  };
}
