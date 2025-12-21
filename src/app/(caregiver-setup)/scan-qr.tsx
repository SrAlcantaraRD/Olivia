import {
  type BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useAdapters } from '@/adapter';
import type { TInviteChunk } from '@/domain/carer/entity/invite-bundle.entity';
import { useImportInvite } from '@/domain/carer/hook/import-invite.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

const INVALID_CHUNK_KEY = 'page.caregiver-setup.scan-qr.error.invalid-chunk';

export default function ScanQRScreen() {
  const {
    notifyAdapter,
    loggerAdapter,
    inviteAdapter,
    carerAdapter,
    cacheAdapter,
    secureStoreAdapter,
    navigationAdapter,
  } = useAdapters();

  const { goToConfirmLink } = useNavigation({ navigationAdapter });

  const { execute: importInvite, isExecuting: isImporting } = useImportInvite({
    loggerAdapter,
    notifyAdapter,
    inviteAdapter,
    carerAdapter,
    cacheAdapter,
    secureStoreAdapter,
  });

  const [hasPermission, requestPermission] = useCameraPermissions();
  const [chunkText, setChunkText] = useState('');
  const [chunks, setChunks] = useState<TInviteChunk[]>([]);
  const [bundleId, setBundleId] = useState<string | null>(null);
  const [chunkTotal, setChunkTotal] = useState<number | null>(null);
  const [decodedBundleId, setDecodedBundleId] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isDecoding, setDecoding] = useState(false);
  const [isProcessingScan, setProcessingScan] = useState(false);
  const scanningRef = useRef(false);

  useEffect(() => {
    void requestPermission();
  }, [requestPermission]);

  const tryAddChunk = useCallback(
    (chunk: TInviteChunk): boolean => {
      if (chunkTotal && chunk.chunkTotal !== chunkTotal) {
        setErrorKey(INVALID_CHUNK_KEY);
        return false;
      }

      if (bundleId && chunk.bundleId !== bundleId) {
        setErrorKey(INVALID_CHUNK_KEY);
        return false;
      }

      if (chunks.some((existing) => existing.chunkIndex === chunk.chunkIndex)) {
        setErrorKey(INVALID_CHUNK_KEY);
        return false;
      }

      setBundleId((prev) => prev ?? chunk.bundleId);
      setChunkTotal((prev) => prev ?? chunk.chunkTotal);
      setChunks((prev) => [...prev, chunk]);
      setErrorKey(null);

      return true;
    },
    [chunkTotal, bundleId, chunks]
  );

  const handleAddChunk = useCallback(() => {
    if (!chunkText.trim()) return;

    try {
      const parsed = JSON.parse(chunkText.trim()) as TInviteChunk;

      const added = tryAddChunk(parsed);

      if (added) {
        setChunkText('');
      }
    } catch (error) {
      notifyAdapter.error({
        title: 'hook.import-invite.error-title',
        description: 'hook.import-invite.error-description',
      });
      loggerAdapter.error('scan-qr', error);
      setErrorKey(INVALID_CHUNK_KEY);
    }
  }, [chunkText, tryAddChunk, notifyAdapter, loggerAdapter]);

  const handleBarCodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (scanningRef.current) {
        return;
      }

      scanningRef.current = true;
      setProcessingScan(true);

      try {
        const parsed = JSON.parse(data) as TInviteChunk;
        tryAddChunk(parsed);
      } catch (error) {
        notifyAdapter.error({
          title: 'hook.import-invite.error-title',
          description: 'hook.import-invite.error-description',
        });
        loggerAdapter.error('scan-qr', error);
        setErrorKey(INVALID_CHUNK_KEY);
      } finally {
        setTimeout(() => {
          scanningRef.current = false;
          setProcessingScan(false);
        }, 750);
      }
    },
    [tryAddChunk, notifyAdapter, loggerAdapter]
  );

  const handleReset = useCallback(() => {
    setChunkText('');
    setChunks([]);
    setBundleId(null);
    setChunkTotal(null);
    setDecodedBundleId(null);
    setErrorKey(null);
  }, []);

  useEffect(() => {
    if (!chunkTotal || chunkTotal <= 0) return;
    if (chunks.length !== chunkTotal) return;
    if (!bundleId || decodedBundleId === bundleId) return;

    setDecoding(true);

    (async () => {
      try {
        const bundle = await inviteAdapter.decodeChunksToBundle(chunks);
        setDecodedBundleId(bundle.metadata.nonce);

        const response = await importInvite({ bundle });

        if (response.success) {
          goToConfirmLink({
            carerName: bundle.payload.carer.name,
          });
        } else {
          setErrorKey(INVALID_CHUNK_KEY);
        }
      } catch (error) {
        loggerAdapter.error('scan-qr', error);
        setErrorKey(INVALID_CHUNK_KEY);
      } finally {
        setDecoding(false);
      }
    })();
  }, [
    chunkTotal,
    chunks,
    bundleId,
    decodedBundleId,
    inviteAdapter,
    importInvite,
    goToConfirmLink,
    loggerAdapter,
  ]);

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-8 pb-8"
    >
      <View className="gap-6">
        <TypographyTitle
          testID="screen.caregiver-setup.scan-qr.title"
          i18nKey="caregiver-setup.scan-qr.title"
        />

        <View className="overflow-hidden rounded-3xl bg-black">
          {hasPermission?.granted ? (
            <View className="relative aspect-video">
              <CameraView
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                style={{ flex: 1 }}
              />
              <View className="absolute inset-0 items-center justify-center">
                <TypographyParagraph
                  testID="screen.caregiver-setup.scan-qr.camera-hint"
                  i18nKey="page.caregiver-setup.scan-qr.camera-hint"
                  className="bg-black/60 px-4 py-1 text-white"
                />
              </View>
              {isProcessingScan && (
                <View className="absolute inset-0 items-center justify-center">
                  <SpinnerAtom testID="screen.caregiver-setup.scan-qr.camera-spinner" />
                </View>
              )}
            </View>
          ) : (
            <View className="p-4">
              <TypographyParagraph
                testID="screen.caregiver-setup.scan-qr.camera-permission"
                i18nKey="page.caregiver-setup.scan-qr.camera-permission"
              />
              <ButtonAtom
                title="page.caregiver-setup.scan-qr.camera-request"
                onPress={() => void requestPermission()}
                testID="screen.caregiver-setup.scan-qr.camera-request"
              />
            </View>
          )}
        </View>

        <TypographyParagraph
          testID="screen.caregiver-setup.scan-qr.instructions"
          i18nKey="page.caregiver-setup.scan-qr.instructions"
        />

        <TextFieldAtom
          value={chunkText}
          onChangeText={setChunkText}
          placeholder="page.caregiver-setup.scan-qr.input.placeholder"
          multiline
          numberOfLines={4}
          testID="screen.caregiver-setup.scan-qr.input"
        />

        <View className="flex-row gap-3">
          <ButtonAtom
            title="page.caregiver-setup.scan-qr.add-chunk"
            onPress={handleAddChunk}
            testID="screen.caregiver-setup.scan-qr.add-chunk"
            isDisabled={isDecoding || isImporting}
          />
          <ButtonAtom
            title="page.caregiver-setup.scan-qr.reset"
            onPress={handleReset}
            testID="screen.caregiver-setup.scan-qr.reset"
            isDisabled={isDecoding || isImporting}
          />
        </View>

        <TypographyParagraph
          testID="screen.caregiver-setup.scan-qr.progress"
          className="text-sm"
          i18nKey="page.caregiver-setup.scan-qr.status"
          values={{
            count: chunks.length,
            total: chunkTotal ?? 0,
          }}
        />
        <View className="space-y-2">
          {chunks.map((chunk) => (
            <TypographyParagraph
              key={`${chunk.bundleId}-${chunk.chunkIndex}`}
              className="text-xs text-muted"
              testID="page.caregiver-setup.scan-qr.chunk-item"
              i18nKey="page.caregiver-setup.scan-qr.chunk-item"
              values={{
                index: chunk.chunkIndex + 1,
                total: chunk.chunkTotal,
              }}
            />
          ))}
        </View>

        {errorKey && (
          <TypographyParagraph
            testID="screen.caregiver-setup.scan-qr.error"
            i18nKey={errorKey}
            className="text-error"
          />
        )}

        {(isDecoding || isImporting) && (
          <View className="items-center">
            <SpinnerAtom />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
