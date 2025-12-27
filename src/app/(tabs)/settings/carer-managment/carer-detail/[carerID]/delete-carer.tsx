import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useDeleteCarer } from '@/domain/carer/hook/delete-carer.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function ModalDeleteCarer() {
  const { carerID, carerName } = useLocalSearchParams<{
    carerID: string;
    carerName: string;
  }>();

  const { carerAdapter, notifyAdapter, loggerAdapter, navigationAdapter } =
    useAdapters();

  const { goBack } = useNavigation({
    navigationAdapter,
  });

  const { execute: deleteCarer, isExecuting: isDeleting } = useDeleteCarer({
    carerAdapter,
    loggerAdapter,
    notifyAdapter,
  });

  const handleDelete = async () => {
    if (!carerID) return;
    const response = await deleteCarer({ carerID: Number(carerID) });
    if (response.success) {
      goBack();
    }
  };

  const handleCancel = () => {
    goBack();
  };

  return (
    <ScreenLayout
      title="page.carer-management.delete-modal.title"
      testID="modal.delete-carer"
    >
      <View className="flex-1 p-4 space-y-4">
        <TypographyTitle
          i18nKey="page.carer-management.delete-modal.title"
          className="text-center"
          testID="modal.delete.title"
        />
        <TypographyParagraph
          i18nKey="page.carer-management.delete-modal.subtitle"
          values={{ name: carerName ?? '' }}
          testID="modal.delete.subtitle"
        />
        <View className="flex-row gap-2">
          <ButtonAtom
            title="common.cancel"
            onPress={handleCancel}
            testID="modal.delete.cancel"
          />
          <ButtonAtom
            title="page.carer-management.delete-modal.confirm"
            onPress={handleDelete}
            isDisabled={isDeleting}
            testID="modal.delete.confirm"
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
