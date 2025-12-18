import { renderHook } from '@testing-library/react-native';
import type { Href } from 'expo-router';

import type { INavigationPort } from '@/domain/core/port/navigation.port';
import { useNavigation } from '@/hooks/use-navigation.hook';

describe('[Hook] useNavigation', () => {
  let mockNavigationAdapter: jest.Mocked<INavigationPort>;

  beforeEach(() => {
    mockNavigationAdapter = {
      navigateTo: jest.fn(),
      goBack: jest.fn(),
    };
  });

  it('should call navigateTo on adapter when navigateTo is called', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.navigateTo('/(onboarding)/role-selection');

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(onboarding)/role-selection' satisfies Href
    );
  });

  it('should call goBack on adapter when goBack is called', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goBack();

    expect(mockNavigationAdapter.goBack).toHaveBeenCalled();
  });

  it('should call navigateTo with role selection route on goToRoleSelection', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToRoleSelection();

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(onboarding)/role-selection' satisfies Href
    );
  });

  it('should call navigateTo with parent setup route on goToParentSetup', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToParentSetup();

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(onboarding)/parent-setup' satisfies Href
    );
  });

  it('should call navigateTo with confirm link route on goToConfirmLink', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToConfirmLink();

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(caregiver-setup)/confirm-link' satisfies Href satisfies Href
    );
  });

  it('should call navigateTo with scan qr route on goToScanQr', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToScanQr();

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(caregiver-setup)/scan-qr' satisfies Href
    );
  });

  it('should call navigateTo with register cic route on goToRegister', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToRegister(1);

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(tabs)/register/execute-register?moduleID=1' satisfies Href
    );
  });

  it('should call navigateTo with filter history route on goToFilterHistory', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToFilterHistory();

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(modals)/modal-filter-history' satisfies Href
    );
  });

  it('should call navigateTo with onboarding route on goToOnboarding', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToOnboarding();

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(onboarding)' satisfies Href
    );
  });
});
