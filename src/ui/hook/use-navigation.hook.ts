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

  const goToSecondaryCarerSetup = useCallback(() => {
    navigateTo('/(onboarding)/secondary-carer-setup');
  }, []);

  const goToSyncronization = useCallback((carerID: TID) => {
    navigateTo(
      `/(tabs)/settings/carer-managment/carer-detail/${carerID}/synchronization`
    );
  }, []);

  const goToGenerateInvitationQR = useCallback((carerID: TID) => {
    navigateTo(
      `/(tabs)/settings/carer-managment/carer-detail/${carerID}/generate-invitation-qr`
    );
  }, []);

  const goToRegister = useCallback((moduleID: TID) => {
    navigateTo(`/(tabs)/register/execute-register?moduleID=${moduleID}`);
  }, []);

  const goToRegisterHome = useCallback(() => {
    navigateTo('/(tabs)/register');
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
    navigateTo('/(tabs)/settings/carer-managment');
  }, []);

  const goToCarerDetail = useCallback((carerID: TID) => {
    navigateTo(`/(tabs)/settings/carer-managment/carer-detail/${carerID}`);
  }, []);

  const goToLogOut = useCallback(() => {
    navigateTo('/(tabs)/settings/log-out');
  }, []);

  const goToAbout = useCallback(() => {
    navigateTo('/(tabs)/settings/about');
  }, []);

  const goToSummaryHome = useCallback(() => {
    navigateTo('/(tabs)/summary');
  }, []);

  const goToSummaryAllData = useCallback(() => {
    navigateTo('/(tabs)/summary/all-data');
  }, []);

  const goToSummaryTrends = useCallback(() => {
    navigateTo('/(tabs)/summary/trends');
  }, []);

  const goToSummaryHighlights = useCallback(() => {
    navigateTo('/(tabs)/summary/highlights');
  }, []);

  const goToSummaryModuleDetail = useCallback((moduleId: string) => {
    navigateTo(`/(tabs)/summary/detail/module/${moduleId}`);
  }, []);

  const goToSummaryFieldDetail = useCallback(
    (moduleId: string, fieldId: string) => {
      navigateTo(`/(tabs)/summary/detail/module/${moduleId}/field/${fieldId}`);
    },
    []
  );

  const goToSummaryTrendDetail = useCallback((trendId: string) => {
    navigateTo(`/(tabs)/summary/detail/trend/${trendId}`);
  }, []);

  // Add more as needed

  return {
    navigateTo,
    goBack,
    goToRoleSelection,
    goToParentSetup,
    goToSecondaryCarerSetup,
    goToSyncronization,
    goToRegister: goToRegister,
    goToRegisterHome,
    goToOnboarding,
    goToAppSettings,
    goToChildProfile,
    goToCarerManagement,
    goToCarerDetail,
    goToGenerateInvitationQR,
    goToLogOut,
    goToAbout,
    goToSummaryHome,
    goToSummaryAllData,
    goToSummaryTrends,
    goToSummaryHighlights,
    goToSummaryModuleDetail,
    goToSummaryFieldDetail,
    goToSummaryTrendDetail,
  };
};
