import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { useCreateSecondaryCarer } from '@/domain/carer/hook/create-secondary-carer.hook';
import { useDeleteCarer } from '@/domain/carer/hook/delete-carer.hook';
import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { useGetEntityList } from '@/domain/core/hooks/get-entity-list.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { CarerCard } from '@/ui/components/molecules/CarerCard';
import { CreateSecondaryCarerModal } from '@/ui/components/molecules/CreateSecondaryCarerModal';
import { DeleteCarerModal } from '@/ui/components/molecules/DeleteCarerModal';

const STATUS_LABEL_MAP: Record<STATUS_ENUM, string> = {
  [STATUS_ENUM.ACTIVE]: 'page.carer-management.card.status-active',
  [STATUS_ENUM.INACTIVE]: 'page.carer-management.card.status-inactive',
};

export default function CarerManagementScreen() {
  const { carerAdapter, notifyAdapter, loggerAdapter, navigationAdapter } =
    useAdapters();

  const { goToCarerDetail, goToSyncronization, goToGenerateInvitationQR } =
    useNavigation({
      navigationAdapter,
    });

  const {
    execute: fetchCarers,
    isExecuting: isFetchingCarers,
    items: carerList = [],
  } = useGetEntityList(ENTITY_NAME.CARER, notifyAdapter, carerAdapter);

  const { execute: deleteCarer, isExecuting: isDeletingCarer } = useDeleteCarer(
    {
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
    }
  );

  const { execute: createSecondaryCarer, isExecuting: isCreatingCarer } =
    useCreateSecondaryCarer({
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
    });

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCarerName, setNewCarerName] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [carerToDelete, setCarerToDelete] = useState<TCarer | null>(null);

  useEffect(() => {
    void fetchCarers();
  }, [fetchCarers]);

  const sortedCarers = useMemo(() => {
    return [...carerList].sort((a, b) => {
      if (a.isPrimary === b.isPrimary) {
        return a.name.localeCompare(b.name);
      }
      return a.isPrimary ? -1 : 1;
    });
  }, [carerList]);

  const primaryCarers = useMemo(
    () => sortedCarers.filter((carer) => carer.isPrimary),
    [sortedCarers]
  );

  const secondaryCarers = useMemo(
    () => sortedCarers.filter((carer) => !carer.isPrimary),
    [sortedCarers]
  );

  const handleCreateCarer = useCallback(async () => {
    if (!newCarerName.trim()) return;
    const response = await createSecondaryCarer({
      name: newCarerName.trim(),
    });
    if (response.success) {
      setNewCarerName('');
      setCreateModalVisible(false);
      void fetchCarers();
    }
  }, [createSecondaryCarer, fetchCarers, newCarerName]);

  const handleRequestDelete = useCallback((carer: TCarer) => {
    setCarerToDelete(carer);
    setDeleteModalVisible(true);
  }, []);

  const handleDeleteCarer = useCallback(async () => {
    if (!carerToDelete) return;
    const response = await deleteCarer({ carerID: carerToDelete.id });
    if (response.success) {
      setDeleteModalVisible(false);
      void fetchCarers();
    }
  }, [carerToDelete]);

  return (
    <ScreenLayout
      title="page.carer-management.title"
      subtitle="page.carer-management.description"
      testID="screen.settings.carer-management"
    >
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <ButtonAtom
          title="page.carer-management.create-secondary"
          onPress={() => setCreateModalVisible(true)}
          testID="carer-management.create-secondary"
        />

        {isFetchingCarers && (
          <View className="items-center py-16">
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

        {!!primaryCarers.length && (
          <View className="space-y-2">
            <TypographyTitle
              testID="carer-management.primary-heading"
              i18nKey="page.carer-management.section.primary"
            />
            {primaryCarers.map((carer) => (
              <CarerCard
                key={carer.id}
                carer={carer}
                statusLabelKey={STATUS_LABEL_MAP[carer.status]}
                roleLabelKey="page.carer-management.card.primary"
                onDetail={() => goToCarerDetail(carer.id)}
              />
            ))}
          </View>
        )}

        {!!secondaryCarers.length && (
          <View className="space-y-2">
            <TypographyTitle
              testID="carer-management.secondary-heading"
              i18nKey="page.carer-management.section.secondary"
            />
            {secondaryCarers.map((carer) => (
              <CarerCard
                key={carer.id}
                carer={carer}
                statusLabelKey={STATUS_LABEL_MAP[carer.status]}
                roleLabelKey="page.carer-management.card.secondary"
                onDetail={() => goToCarerDetail(carer.id)}
                onInvite={
                  carer.status === STATUS_ENUM.ACTIVE
                    ? () => goToGenerateInvitationQR(carer.id)
                    : undefined
                }
                onSync={() => goToSyncronization(carer.id)}
                onDelete={handleRequestDelete}
                inviteDisabled={carer.status !== STATUS_ENUM.ACTIVE}
                deleting={isDeletingCarer}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <CreateSecondaryCarerModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        carerName={newCarerName}
        onChange={(value) => setNewCarerName(value)}
        onCreate={handleCreateCarer}
        isCreating={isCreatingCarer}
      />
      <DeleteCarerModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteCarer}
        carerName={carerToDelete?.name}
        isDeleting={isDeletingCarer}
      />
    </ScreenLayout>
  );
}
