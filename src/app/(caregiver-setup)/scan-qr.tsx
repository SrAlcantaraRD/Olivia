import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useAdapters } from '@/adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { useImportInvite } from '@/domain/carer/hook/import-invite.hook';
import type { TInviteChunk } from '@/domain/carer/entity/invite-bundle.entity';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

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

  const [chunkText, setChunkText] = useState('');
  const [chunks, setChunks] = useState<TInviteChunk[]>([]);
  const [bundleId, setBundleId] = useState<string | null>(null);
  const [chunkTotal, setChunkTotal] = useState<number | null>(null);
  const [decodedBundleId, setDecodedBundleId] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isDecoding, setDecoding] = useState(false);

  const handleAddChunk = useCallback(() => {
    if (!chunkText.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(chunkText.trim()) as TInviteChunk;

      if (chunkTotal && parsed.chunkTotal !== chunkTotal) {
        setErrorKey('page.caregiver-setup.scan-qr.error.invalid-chunk');
        return;
      }

      if (bundleId && parsed.bundleId !== bundleId) {
        setErrorKey('page.caregiver-setup.scan-qr.error.invalid-chunk');
        return;
      }

      if (chunks.some((chunk) => chunk.chunkIndex === parsed.chunkIndex)) {
        setErrorKey('page.caregiver-setup.scan-qr.error.invalid-chunk');
        return;
      }

      setBundleId(parsed.bundleId);
      setChunkTotal(parsed.chunkTotal);
      setChunks((prev) => [...prev, parsed]);
      setChunkText('');
      setErrorKey(null);
    } catch (error) {
      notifyAdapter.error({
        title: 'hook.import-invite.error-title',
        description: 'hook.import-invite.error-description',
      });
      loggerAdapter.error('scan-qr', error);
      setErrorKey('page.caregiver-setup.scan-qr.error.invalid-chunk');
    }
  }, [chunkText, chunkTotal, bundleId, chunks, notifyAdapter, loggerAdapter]);

  const handleReset = useCallback(() => {
    setChunkText('');
    setChunks([]);
    setBundleId(null);
    setChunkTotal(null);
    setDecodedBundleId(null);
    setErrorKey(null);
  }, []);

  useEffect(() => {
    if (!chunkTotal || chunkTotal <= 0) {
      return;
    }

    if (chunks.length !== chunkTotal) {
      return;
    }

    if (!bundleId || decodedBundleId === bundleId) {
      return;
    }

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
          setErrorKey('page.caregiver-setup.scan-qr.error.invalid-chunk');
        }
      } catch (error) {
        loggerAdapter.error('scan-qr', error);
        setErrorKey('page.caregiver-setup.scan-qr.error.invalid-chunk');
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
      contentContainerClassName="px-4 pt-8"
    >
      <View className="gap-6">
        <TypographyTitle
          testID="screen.caregiver-setup.scan-qr.title"
          i18nKey="caregiver-setup.scan-qr.title"
        />
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
