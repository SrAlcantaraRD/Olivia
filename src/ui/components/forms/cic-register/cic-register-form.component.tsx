import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import type { TRecordFieldCreate } from '@/domain/module/entity/record-field.entity';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { useCreateRecord } from '@/domain/module/hook/create-record.hook';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';

/**
 * CIC Registration Form Component
 * Orchestrates the 5-step wizard for registering a CIC (Clean Intermittent Catheterization)
 * Follows the same pattern as ParentSetupForm for consistency
 */
export function CicRegisterForm() {
  const router = useRouter();

  const { moduleAdapter, notifyAdapter, recordAdapter, recordFieldAdapter } =
    useAdapters();

  const {
    isExecuting: isModulesLoading,
    execute: executeGetModules,
    items: modules,
  } = useGetListActiveModule({
    loggerAdapter: BASE_LOGGER,
    moduleAdapter,
    notifyAdapter,
  });

  const loadModules = async () => {
    await executeGetModules();
  };

  useEffect(() => {
    loadModules();
  }, []);

  // wire create record hook
  const { isExecuting: isSaving, execute: executeCreateRecord } =
    useCreateRecord({
      loggerAdapter: BASE_LOGGER,
      recordAdapter,
      notifyAdapter,
      recordFieldAdapter,
    });

  const handleOnComplete = async (values: Record<number, string>) => {
    // Build TRecordCreate payload, avoid using non-null assertions
    const cicModule = modules.find((m) => m.code === MODULE_KEY_ENUM.CIC);
    if (!cicModule) return;

    const payload = {
      moduleID: cicModule.id,
      carerID: 2, // FIXME: Use the id of the carer saved at cache.
      data: JSON.stringify({ values }),
      synced: false,
      fieldList: Object.entries(values).map(([fieldID, value]) => ({
        fieldID: Number(fieldID),
        value,
      })) satisfies TRecordFieldCreate[],
    } satisfies TRecordCreate;

    const response = await executeCreateRecord(payload);

    if (response?.success) {
      router.back();
    }
  };

  return (
    <View className="flex-1 px-4 py-6" testID="cic-register-form">
      {modules.map((module) => (
        <ModuleWizard
          key={`module-wizard.${module.code}`}
          module={module}
          testID={`module-wizard.${module.code}`}
          onComplete={handleOnComplete}
        />
      ))}
    </View>
  );
}
