import type { Href } from 'expo-router';
import { useCallback } from 'react';

import type { INavigationPort } from '@/domain/ports/navigation.port';

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

  const goToRegisterCic = useCallback(() => {
    navigateTo('/(modals)/modal-register-cic');
  }, []);

  const goToFilterHistory = useCallback(() => {
    navigateTo('/(modals)/modal-filter-history');
  }, []);

  const goToOnboarding = useCallback(() => {
    navigateTo('/(onboarding)');
  }, []);

  // Add more as needed

  return {
    navigateTo,
    goBack,
    goToRoleSelection,
    goToParentSetup,
    goToConfirmLink,
    goToScanQr,
    goToRegisterCic,
    goToFilterHistory,
    goToOnboarding,
  };
};
