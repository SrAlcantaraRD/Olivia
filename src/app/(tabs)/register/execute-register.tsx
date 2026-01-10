import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { useCreateRecord } from '@/domain/module/hook/create-record.hook';
import { useGetListModuleField } from '@/domain/module/hook/get-list-module-field.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';

export default function ExecuteRegister() {
  const { moduleID } = useLocalSearchParams<{ moduleID: string }>();

  const {
    notifyAdapter,
    recordAdapter,
    recordFieldAdapter,
    loggerAdapter,
    navigationAdapter,
    moduleFieldAdapter,
    cacheAdapter,
  } = useAdapters();

  const { isExecuting: isModulesLoading, execute: executeGetModuleFieldList } =
    useGetListModuleField({
      loggerAdapter,
      moduleFieldAdapter,
      notifyAdapter,
    });

  // wire create record hook
  const { isExecuting: isSaving, execute: executeCreateRecord } =
    useCreateRecord({
      loggerAdapter,
      recordAdapter,
      notifyAdapter,
      recordFieldAdapter,
      cacheAdapter,
    });

  const handlerLoadModuleFieldList = async (moduleID: TID) => {
    await executeGetModuleFieldList({ moduleID });
  };

  const handleOnComplete = async (values: Record<TID, string>) => {
    BASE_LOGGER.error({ executeCreateRecord: values });

    const payload: TRecordCreate = {
      moduleID: Number(moduleID),
      carerID: 0,
      synchronized: false,
      recordFieldList: Object.entries(values).map(([fieldId, value]) => ({
        fieldID: Number(fieldId),
        value,
        recordID: -1,
      })),
      createdAt: new Date(),
    };

    const response = await executeCreateRecord(payload);

    if (response?.success) {
      navigationAdapter.goBack();
    }
  };

  useEffect(() => {
    if (moduleID) handlerLoadModuleFieldList(Number(moduleID));
  }, [moduleID]);

  return (
    <ScreenLayout
      testID="execute-register"
      isLoading={isModulesLoading || isSaving}
    >
      <ModuleWizard
        key={`module-wizard.module.${moduleID}`}
        testID={`module-wizard.module.${moduleID}`}
        moduleID={Number(moduleID)}
        adapters={{ loggerAdapter, moduleFieldAdapter, notifyAdapter }}
        onComplete={handleOnComplete}
        onGoBack={() => navigationAdapter.goBack()}
      />
    </ScreenLayout>
  );
}
