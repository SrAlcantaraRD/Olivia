import { useEffect } from 'react';
import { View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { useNavigation } from '@/hooks/use-navigation.hook';
import {
  TypographyHeading,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
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

  const handlerOnSelectAction = (code: MODULE_KEY_ENUM) => {
    switch (code) {
      case MODULE_KEY_ENUM.CIC:
        goToRegister();
        break;
      case MODULE_KEY_ENUM.STOOL:
      case MODULE_KEY_ENUM.ENEMA:
      case MODULE_KEY_ENUM.URINE:
      case MODULE_KEY_ENUM.MEDICATION:
        break;
    }
  };

  const handlerGetList = async () => {
    await execute();
  };

  useEffect(() => {
    handlerGetList();
  }, []);

  return (
    <ScreenLayout testID="screen.register" isLoading={isExecuting}>
      {/* Header */}
      <View className="gap-2">
        <TypographyTitle
          i18nKey="page.register.title"
          accessibilityRole="header"
        />
        <TypographySmall i18nKey="page.register.subtitle" variant="light" />
      </View>

      {/* Quick Actions */}
      <View className="gap-4">
        <TypographyHeading
          i18nKey="page.register.quick_actions"
          accessibilityRole="header"
        />

        {Array.isArray(items) &&
          items.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              testID="register"
              isSelected={false}
              onSelect={() => {
                goToRegister();
              }}
            />
          ))}
      </View>
    </ScreenLayout>
  );
}
