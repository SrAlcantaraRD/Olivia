import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useActiveCarer } from '@/domain/carer/hook/use-active-carer.hook';
import { useAddDemoData } from '@/domain/core/hook/add-demo-data.hook';
import { RowEmptyAtom } from '@/ui/components/atoms/row-empty.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import {
  RowAction,
  type RowActionProps,
} from '@/ui/components/molecules/row-action.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function SettingsScreen() {
  const adapters = useAdapters();
  const { navigationAdapter } = adapters;
  const {
    goToAppSettings,
    goToLogOut,
    goToChildProfile,
    goToCarerManagement,
    goToRecordSynchronizationSender,
    goToAbout,
  } = useNavigation({ navigationAdapter });

  const { carer } = useActiveCarer(adapters);

  const { execute: addDemoData } = useAddDemoData(adapters);

  const handleAddDemoData = async () => {
    await addDemoData();
  };

  const dynamicSettingsRows: RowActionProps[] = useMemo(() => {
    const isPrimaryCarer = carer?.isPrimary ?? false;

    if (isPrimaryCarer) {
      return [
        {
          testID: 'screen.settings.section_configuration',
          title: 'page.settings.section-configuration',
          description: 'page.settings.child-profile-desc',
          iconName: 'person-circle',
          onPress: goToChildProfile,
        },
        {
          testID: 'screen.settings.manage-carers',
          title: 'page.settings.manage-carers',
          description: 'page.settings.manage-carers-desc',
          iconName: 'people',
          onPress: goToCarerManagement,
        },
      ] satisfies RowActionProps[];
    }

    return [
      {
        testID: 'screen.settings.sync-records',
        title: 'page.settings.sync-records',
        description: 'page.settings.sync-records-desc',
        iconName: 'sync',
        onPress: goToRecordSynchronizationSender,
      },
    ] satisfies RowActionProps[];
  }, [carer?.isPrimary]);

  return (
    <ScreenLayout
      testID="screen.settings"
      title="page.settings.title"
      subtitle="page.settings.subtitle"
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        className="gap-4"
      >
        <View className="gap-4">
          {/* TODO: Añadir avatar del carer logueada y nombre */}
          <View className="gap-2">
            {/* Child Profile Section */}
            <TypographyTitle
              testID="screen.settings.section_configuration"
              i18nKey="page.settings.section-configuration"
              size="lg"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            {dynamicSettingsRows.map((row) => (
              <RowAction
                key={row.testID}
                iconName={row.iconName}
                title={row.title}
                description={row.description}
                onPress={row.onPress}
                testID={row.testID}
              />
            ))}
          </View>
          <View className="gap-2">
            {/* App Settings Section */}
            <TypographyParagraph
              testID="screen.settings.section-app"
              i18nKey="page.settings.section-app"
              className="font-semibold text-default-400 uppercase"
              accessibilityRole="header"
            />

            <RowAction
              iconName="settings"
              title="page.settings.app-settings"
              description="page.settings.app-settings-desc"
              onPress={goToAppSettings}
              testID="screen.settings.app-settings"
            />

            <RowAction
              iconName="add-circle"
              title="page.settings.add-demo-data"
              description="page.settings.add-demo-data-desc"
              onPress={handleAddDemoData}
              testID="screen.settings.add-demo-data"
            />

            <RowAction
              iconName="information-circle"
              title="page.settings.about"
              description="page.settings.about-desc"
              onPress={goToAbout}
              testID="screen.settings.about"
            />

            {/* Danger Zone */}
            <RowAction
              iconName="log-out"
              title="page.settings.logout"
              description="page.settings.logout-desc"
              onPress={goToLogOut}
              testID="screen.settings.logout-row"
              variant="danger"
            />
          </View>
        </View>
        <RowEmptyAtom />
      </ScrollView>
    </ScreenLayout>
  );
}
