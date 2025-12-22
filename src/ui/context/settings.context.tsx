import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { useAppSettings } from '@/domain/core/hook/use-app-settings.hook';

const SettingsContext = createContext<Record<string, unknown> | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { cacheAdapter } = useAdapters();
  const { initSettings, isExecuting } = useAppSettings({
    loggerAdapter: BASE_LOGGER,
    cacheAdapter,
  });

  const [isInitializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      await initSettings();
      setInitializing(false);
    })();
  }, []);

  if (isInitializing || isExecuting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SettingsContext.Provider value={{}}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = (): Record<string, unknown> => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};
