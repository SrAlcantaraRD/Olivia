import { useAdapters } from '@/adapter';
import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';
import { useGetEntityList } from '@/domain/core/hooks/get-entity-list.hook';
import { ParentSetupForm } from '@/ui/components/forms/parent-setup';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function ParentSetupScreen() {
  const { notifyAdapter, moduleAdapter } = useAdapters();

  const { isExecuting } = useGetEntityList(
    ENTITY_NAME.MODULE,
    notifyAdapter,
    moduleAdapter
  );

  return (
    <ScreenLayout testID="parent-setup-screen" isLoading={isExecuting}>
      <ParentSetupForm />
    </ScreenLayout>
  );
}
