import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

import { useAdapters } from '@/adapter';
import { useCreateInvite } from '@/domain/carer/hook/create-invite.hook';
import type { TInviteChunk } from '@/domain/carer/entity/invite-bundle.entity';
import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { useGetEntityList } from '@/domain/core/hooks/get-entity-list.hook';
import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import {
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function CarerManagementScreen() {
  const { carerAdapter, notifyAdapter, loggerAdapter, inviteAdapter } =
    useAdapters();

  const {
    execute: fetchCarers,
    isExecuting: isFetchingCarers,
    items: carerList,
  } = useGetEntityList(ENTITY_NAME.CARER, notifyAdapter, carerAdapter);

  const { execute: generateInvite, isExecuting: isGeneratingInvite } =
    useCreateInvite({
      loggerAdapter,
      notifyAdapter,
      carerAdapter,
      inviteAdapter,
    });

  const [selectedCarer, setSelectedCarer] = useState<TCarer | null>(null);
  const [inviteChunks, setInviteChunks] = useState<TInviteChunk[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChunking, setChunking] = useState(false);

  useEffect(() => {
    void fetchCarers();
  }, [fetchCarers]);

  const handleInvitePress = useCallback(
    async (carer: TCarer) => {
      const response = await generateInvite({ carerId: carer.id });

      if (!response.success || !response.details) {
        return;
      }

      setChunking(true);
      try {
        const chunkList = await inviteAdapter.encodeBundleToChunks(
          response.details
        );
        setInviteChunks(chunkList);
        setSelectedCarer(carer);
        setModalVisible(true);
      } catch (error) {
        loggerAdapter.error('carer-management', error);
      } finally {
        setChunking(false);
      }
    },
    [generateInvite, inviteAdapter, loggerAdapter]
  );

  const handleCopyChunk = useCallback(
    async (chunk: TInviteChunk) => {
      const payload = JSON.stringify(chunk);

      await Clipboard.setStringAsync(payload);
      notifyAdapter.success({
        title: 'common.success',
        description: 'page.carer-management.invitation-modal.copy',
      });
    },
    [notifyAdapter]
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedCarer(null);
    setInviteChunks([]);
  }, []);

  const invitationModalContent = useMemo(
    () => (
      <View className="bg-background rounded-3xl p-4 max-h-[80%] w-full z-10">
        <TypographyTitle
          testID="modal.carer-invite.title"
          i18nKey="page.carer-management.invitation-modal.title"
          className="text-center"
        />
        {selectedCarer && (
          <TypographyParagraph
            testID="modal.carer-invite.subtitle"
            i18nKey="page.carer-management.invitation-modal.instructions"
            className="mb-4 text-center"
          />
        )}
        <TypographyParagraph
          testID="modal.carer-invite.progress"
          className="text-center mb-4"
          i18nKey="page.carer-management.invitation-modal.progress"
          values={{
            count: inviteChunks.length,
            total: inviteChunks[0]?.chunkTotal ?? 0,
          }}
        />
        {isChunking && (
          <View className="items-center">
            <SpinnerAtom testID="modal.carer-invite.spinner" />
          </View>
        )}
        <ScrollView
          className="space-y-4"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {inviteChunks.map((chunk) => (
            <CardAtom
              key={`${chunk.bundleId}-${chunk.chunkIndex}`}
              className="p-4"
            >
              <View className="mb-2">
                <TypographySmall
                  testID={`modal.carer-invite.chunk.${chunk.chunkIndex}.label`}
                  i18nKey="page.carer-management.invitation-modal.chunks-title"
                  values={{
                    index: chunk.chunkIndex + 1,
                    total: chunk.chunkTotal,
                  }}
                />
              </View>
              <View className="items-center mb-4">
                <QRCode value={JSON.stringify(chunk)} size={220} />
              </View>
              <View className="flex-row items-center justify-between gap-2">
                <Text
                  className="flex-1 text-xs text-muted"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {chunk.data}
                </Text>
                <ButtonAtom
                  title="page.carer-management.invitation-modal.copy"
                  onPress={() => void handleCopyChunk(chunk)}
                  testID={`modal.carer-invite.chunk.${chunk.chunkIndex}.copy`}
                />
              </View>
            </CardAtom>
          ))}
        </ScrollView>
        <ButtonAtom
          title="page.carer-management.invitation-modal.close"
          onPress={handleCloseModal}
          testID="modal.carer-invite.close-button"
        />
      </View>
    ),
    [handleCloseModal, handleCopyChunk, inviteChunks, isChunking, selectedCarer]
  );

  const sortedCarers = useMemo(() => {
    return carerList
      ? [...carerList].sort((a, b) => (b.isPrimary ? 1 : -1))
      : [];
  }, [carerList]);

  return (
    <ScreenLayout
      testID="screen.settings.carer-management"
      title="page.carer-management.title"
      subtitle="page.carer-management.description"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {isFetchingCarers && (
          <View className="items-center py-12">
            <SpinnerAtom testID="screen.carer-management.spinner" />
          </View>
        )}

        {!isFetchingCarers && !sortedCarers.length && (
          <CardAtom className="p-4">
            <TypographyParagraph
              testID="screen.carer-management.empty"
              i18nKey="page.carer-management.list-empty"
              variant="light"
            />
          </CardAtom>
        )}

        <View className="space-y-4">
          {sortedCarers.map((carer) => {
            const statusKey =
              carer.status === STATUS_ENUM.ACTIVE
                ? 'page.carer-management.card.status-active'
                : 'page.carer-management.card.status-inactive';
            const roleKey = carer.isPrimary
              ? 'page.carer-management.card.primary'
              : 'page.carer-management.card.secondary';

            return (
              <CardAtom key={carer.id} className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold">{carer.name}</Text>
                    <TypographySmall
                      testID={`carer-card.${carer.id}.role`}
                      i18nKey={roleKey}
                      className="text-muted"
                    />
                  </View>
                  <TypographySmall
                    testID={`carer-card.${carer.id}.status`}
                    i18nKey={statusKey}
                    className={
                      carer.status === STATUS_ENUM.ACTIVE
                        ? 'text-success'
                        : 'text-muted'
                    }
                  />
                </View>
                <Text className="mt-2 text-sm text-muted">{carer.type}</Text>
                <View className="mt-4">
                  <ButtonAtom
                    title="page.carer-management.sync-button"
                    onPress={() => void handleInvitePress(carer)}
                    testID={`carer-card.${carer.id}.sync-button`}
                    isDisabled={!carer.isPrimary || isGeneratingInvite}
                  />
                </View>
              </CardAtom>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 bg-black/60 justify-center px-4 relative">
          <Pressable className="absolute inset-0" onPress={handleCloseModal} />
          {invitationModalContent}
        </View>
      </Modal>
    </ScreenLayout>
  );
}
