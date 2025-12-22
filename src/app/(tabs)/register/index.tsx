import { useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import { ModuleCard } from '@/ui/components/cards/module.card';
import { ScreenLayout } from '@/ui/components/layouts/screen.layout';

export default function RegisterScreen() {
  const { navigationAdapter } = useAdapters();
  const { goToRegister } = useNavigation({
    navigationAdapter,
  });

  const { notifyAdapter, moduleAdapter } = useAdapters();

  const { isExecuting, execute, items } = useGetListActiveModule({
    loggerAdapter: BASE_LOGGER,
    moduleAdapter,
    notifyAdapter,
  });

  const handlerGetList = async () => {
    await execute();
  };

  useEffect(() => {
    handlerGetList();
  }, []);

  return (
    <ScreenLayout
      testID="screen.register"
      isLoading={isExecuting}
      title="page.register.title"
      subtitle="page.register.subtitle"
    >
      {/* Quick Actions */}
      <View className="gap-4">
        {Array.isArray(items) &&
          items.map((module) => (
            <ModuleCard
              testID={`page.register.module-card.${module.code}`}
              key={module.id}
              module={module}
              onPress={() => {
                goToRegister(module.id);
              }}
            />
          ))}
      </View>
    </ScreenLayout>
  );
}
