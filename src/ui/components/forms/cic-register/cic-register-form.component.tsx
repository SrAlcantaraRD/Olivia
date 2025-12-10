import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
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

  const { moduleAdapter, notifyAdapter } = useAdapters();
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
  const { recordAdapter } = useAdapters();
  const { isExecuting: isSaving, execute: executeCreateRecord } =
    useCreateRecord({
      loggerAdapter: BASE_LOGGER,
      recordAdapter,
      notifyAdapter,
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
    } satisfies TRecordCreate;

    const response = await executeCreateRecord(payload);

    if (response?.success) {
      router.back();
    }
  };

  return (
    <>
      {/* Module-driven wizard for CIC */}
      {Array.isArray(modules) &&
        modules.length > 0 &&
        (() => {
          const cicModule = modules.find((m) => m.code === MODULE_KEY_ENUM.CIC);
          if (cicModule) {
            return (
              <ModuleWizard
                module={cicModule}
                testID="demo.module-wizard.cic"
                onComplete={handleOnComplete}
              />
            );
          }
          return null;
        })()}
      {/* If module list is not ready show nothing or a loader in parent */}
    </>
  );
}
