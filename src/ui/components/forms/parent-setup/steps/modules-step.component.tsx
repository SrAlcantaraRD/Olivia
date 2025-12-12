import { useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { ENTITY_NAME } from '@/domain/core/enum/entity-names.enum';
import { useGetEntityList } from '@/domain/core/hooks/get-entity-list.hook';
import type { TID } from '@/domain/core/schemas/id.schema';
import { ModuleCard } from '@/ui/components/cards/module.card';

interface ModulesStepProps {
  selectedModules: Set<TID>;
  onToggleModule: (id: TID) => void;
}

export function ModulesStep({
  selectedModules,
  onToggleModule,
}: ModulesStepProps) {
  const { notifyAdapter, moduleAdapter } = useAdapters();

  const { execute, items } = useGetEntityList(
    ENTITY_NAME.MODULE,
    notifyAdapter,
    moduleAdapter
  );

  const handlerGetList = async () => {
    await execute();
  };

  useEffect(() => {
    handlerGetList();
  }, []);

  return (
    <View className="mb-6">
      {items.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          testID="parent-setup"
          isSelected={selectedModules.has(module.id)}
          onPress={() => onToggleModule(module.id)}
        />
      ))}
    </View>
  );
}
