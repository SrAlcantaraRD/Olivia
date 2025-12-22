import { useFocusEffect } from 'expo-router';
import { Divider } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';
import { useGetEntityList } from '@/domain/core/hook/get-entity-list.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';
import { CarerCardOrganism } from '@/ui/components/organisms/carer-card.organism';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function CarerManagementScreen() {
  const { carerAdapter, notifyAdapter, navigationAdapter } = useAdapters();

  const {
    goToCarerDetail,
    goToSyncronization,
    goToGenerateInvitationQR,
    goToCreateSecondaryCarer,
    goToDeleteCarer,
  } = useNavigation({
    navigationAdapter,
  });

  const { execute: fetchCarers, items: carerList = [] } = useGetEntityList(
    ENTITY_NAME.CARER,
    notifyAdapter,
    carerAdapter
  );

  useEffect(() => {
    fetchCarers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCarers();
    }, [])
  );

  const sortedCarers = useMemo(() => {
    return [...carerList].sort((a, b) => {
      if (a.isPrimary === b.isPrimary) {
        return a.name.localeCompare(b.name);
      }
      return a.isPrimary ? -1 : 1;
    });
  }, [carerList]);

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
            onPress={goToCreateSecondaryCarer}
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
              onDelete={() => goToDeleteCarer(carer.id)}
              onViewDetails={() => goToCarerDetail(carer.id)}
              testID={`carer-card-organism-${carer.id}`}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
