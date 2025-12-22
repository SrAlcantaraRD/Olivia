import { useState } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import { useCreateCarer } from '@/domain/carer/hook/create-carer.hook';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

export default function ModalCreateSecondaryCarer() {
  const { carerAdapter, notifyAdapter, loggerAdapter, navigationAdapter } =
    useAdapters();

  const { goBack } = useNavigation({
    navigationAdapter,
  });

  const { execute: createSecondaryCarer, isExecuting: isCreating } =
    useCreateCarer({
      carerAdapter,
      loggerAdapter,
      notifyAdapter,
    });

  const [carerName, setCarerName] = useState('');

  const handleCreate = async () => {
    if (!carerName.trim()) return;

    const response = await createSecondaryCarer({
      name: carerName.trim(),
      isPrimary: false,
      pinHash: '', // Pin will be set on first sync
      type: CARER_TYPE_ENUM.SECONDARY,
    });
    if (response.success) {
      goBack();
    }
  };

  const handleCancel = () => {
    goBack();
  };

  return (
    <ScreenLayout
      title="page.carer-management.create-modal.title"
      testID="modal.create-secondary-carer"
    >
      <View className="flex-1 p-4 space-y-4">
        <TypographyTitle
          i18nKey="page.carer-management.create-modal.title"
          testID="modal.create.title"
        />
        <TextFieldAtom
          label="page.carer-management.create-modal.name-label"
          placeholder="page.carer-management.create-modal.name-placeholder"
          value={carerName}
          onChangeText={setCarerName}
          testID="modal.create.name"
        />
        <View className="flex-row gap-3">
          <ButtonAtom
            title="common.cancel"
            onPress={handleCancel}
            testID="modal.create.cancel"
          />
          <ButtonAtom
            title="page.carer-management.create-modal.create"
            onPress={handleCreate}
            isDisabled={!carerName.trim() || isCreating}
            testID="modal.create.submit"
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
