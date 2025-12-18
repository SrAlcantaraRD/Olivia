import type { Href } from 'expo-router';
import { useCallback } from 'react';

import type { INavigationPort } from '@/domain/core/port/navigation.port';
import type { TID } from '@/domain/core/schemas/id.schema';

export type AppRoute = Href;

export const useNavigation = (adapters: {
  navigationAdapter: INavigationPort;
}) => {
  const { navigationAdapter } = adapters;

  const navigateTo = useCallback((route: AppRoute) => {
    navigationAdapter.navigateTo(route as string);
  }, []);

  const goBack = useCallback(() => {
    navigationAdapter.goBack();
  }, []);

  // Semantic navigation methods
  const goToRoleSelection = useCallback(() => {
    navigateTo('/(onboarding)/role-selection');
  }, []);

  const goToParentSetup = useCallback(() => {
    navigateTo('/(onboarding)/parent-setup');
  }, []);

  const goToConfirmLink = useCallback(() => {
    navigateTo('/(caregiver-setup)/confirm-link');
  }, []);

  const goToScanQr = useCallback(() => {
    navigateTo('/(caregiver-setup)/scan-qr');
  }, []);

  const goToRegister = useCallback((moduleID: TID) => {
    navigateTo(`/(tabs)/register/execute-register?moduleID=${moduleID}`);
  }, []);

  const goToFilterHistory = useCallback(() => {
    navigateTo('/(modals)/modal-filter-history');
  }, []);

  const goToOnboarding = useCallback(() => {
    navigateTo('/(onboarding)');
  }, []);

  const goToAppSettings = useCallback(() => {
    navigateTo('/(tabs)/settings/app-settings');
  }, []);

  const goToChildProfile = useCallback(() => {
    navigateTo('/(tabs)/settings/child-profile');
  }, []);

  const goToCarerManagement = useCallback(() => {
    navigateTo('/(tabs)/settings/carer-management');
  }, []);

  const goToLogOut = useCallback(() => {
    navigateTo('/(tabs)/settings/log-out');
  }, []);

  const goToAbout = useCallback(() => {
    navigateTo('/(tabs)/settings/about');
  }, []);

  const goToReportHistoryByModule = useCallback((moduleId: string) => {
    navigateTo(`/(tabs)/report/history-detail?moduleId=${moduleId}`);
  }, []);

  const goToReportHistoryByRecord = useCallback((recordId: string) => {
    navigateTo(`/(tabs)/report/history-detail?recordId=${recordId}`);
  }, []);

  // Add more as needed

  return {
    navigateTo,
    goBack,
    goToRoleSelection,
    goToParentSetup,
    goToConfirmLink,
    goToScanQr,
    goToRegister: goToRegister,
    goToFilterHistory,
    goToOnboarding,
    goToAppSettings,
    goToChildProfile,
    goToCarerManagement,
    goToLogOut,
    goToAbout,
    goToReportHistoryByModule,
    goToReportHistoryByRecord,
  };
};
