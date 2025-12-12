import { useEffect } from 'react';

import { useAdapters } from '@/adapter';
import type { TRecordCreate } from '@/domain/module/entity/record.entity';
import { useCreateRecord } from '@/domain/module/hook/create-record.hook';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';

export default function ExecuteRegister() {
  const {
    moduleAdapter,
    notifyAdapter,
    recordAdapter,
    recordFieldAdapter,
    loggerAdapter,
    navigationAdapter,
  } = useAdapters();

  const {
    isExecuting: isModulesLoading,
    execute: executeGetModules,
    items: modules,
  } = useGetListActiveModule({
    loggerAdapter,
    moduleAdapter,
    notifyAdapter,
  });

  // wire create record hook
  const { isExecuting: isSaving, execute: executeCreateRecord } =
    useCreateRecord({
      loggerAdapter,
      recordAdapter,
      notifyAdapter,
      recordFieldAdapter,
    });

  const loadModules = async () => {
    await executeGetModules();
  };

  const handleOnComplete = async (values: TRecordCreate) => {
    const response = await executeCreateRecord(values);

    if (response?.success) {
      navigationAdapter.goBack();
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  return (
    <ScreenLayout
      testID="execute-register"
      isLoading={isModulesLoading || isSaving}
    >
      {modules.map((module) => (
        <ModuleWizard
          key={`module-wizard.${module.code}`}
          testID={`module-wizard.${module.code}`}
          module={module}
          onComplete={handleOnComplete}
        />
      ))}
    </ScreenLayout>
  );
}
