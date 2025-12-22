import { Divider } from 'heroui-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import { useCreateCarer } from '@/domain/carer/hook/create-carer.hook';
import { useDeleteCarer } from '@/domain/carer/hook/delete-carer.hook';
import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';
import { useGetEntityList } from '@/domain/core/hook/get-entity-list.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { CreateSecondaryCarerModal } from '@/ui/components/molecules/create-secondary-carer.modal';
import { DeleteCarerModal } from '@/ui/components/molecules/delete-carer.modal';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';
import { CarerCardOrganism } from '@/ui/components/organisms/carer-card.organism';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function CarerManagementScreen() {
  const { carerAdapter, notifyAdapter, loggerAdapter, navigationAdapter } =
    useAdapters();

  const { goToCarerDetail, goToSyncronization, goToGenerateInvitationQR } =
    useNavigation({
      navigationAdapter,
    });

  const { execute: fetchCarers, items: carerList = [] } = useGetEntityList(
    ENTITY_NAME.CARER,
    notifyAdapter,
    carerAdapter
  );

  const { execute: deleteCarer, isExecuting: isDeletingCarer } = useDeleteCarer(
    {
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
    }
  );

  const { execute: createSecondaryCarer, isExecuting: isCreatingCarer } =
    useCreateCarer({
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
    });

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCarerName, setNewCarerName] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [carerToDelete, setCarerToDelete] = useState<TCarer | null>(null);

  useEffect(() => {
    fetchCarers();
  }, []);

  const sortedCarers = useMemo(() => {
    return [...carerList].sort((a, b) => {
      if (a.isPrimary === b.isPrimary) {
        return a.name.localeCompare(b.name);
      }
      return a.isPrimary ? -1 : 1;
    });
  }, [carerList]);

  const handleCreateCarer = useCallback(async () => {
    if (!newCarerName.trim()) return;

    const response = await createSecondaryCarer({
      name: newCarerName.trim(),
      isPrimary: false,
      pinHash: '', // Pin will be set on first sync
      type: CARER_TYPE_ENUM.SECONDARY,
    });
    if (response.success) {
      setNewCarerName('');
      setCreateModalVisible(false);
      void fetchCarers();
    }
  }, [newCarerName]);

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
        <View className="gap-4">
          <SettingsRow
            iconName="add"
            onPress={() => setCreateModalVisible(true)}
            testID="carer-management.create-secondary"
            titleKey="page.carer-management.create-secondary"
          />

          <Divider className="my-2" />

          {sortedCarers.map((carer) => (
            <CarerCardOrganism
              key={`carer-card.${carer.id}`}
              carer={carer}
              onInviteQR={() => goToGenerateInvitationQR(carer.id)}
              onSync={() => goToSyncronization(carer.id)}
              onDelete={() => handleRequestDelete(carer)}
              onViewDetails={() => goToCarerDetail(carer.id)}
              testID={`carer-card-organism-${carer.id}`}
            />
          ))}
        </View>
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
