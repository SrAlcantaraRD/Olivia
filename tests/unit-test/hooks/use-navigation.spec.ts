import { renderHook } from '@testing-library/react-native';
import type { Href } from 'expo-router';

import type { INavigationPort } from '@/domain/core/port/navigation.port';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

describe('[Hook] useNavigation', () => {
  let mockNavigationAdapter: jest.Mocked<INavigationPort>;

  beforeEach(() => {
    mockNavigationAdapter = {
      navigateTo: jest.fn(),
      goBack: jest.fn(),
      replaceTo: jest.fn(),
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

  it('should call navigateTo with register cic route on goToRegister', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToRegister(1);

    expect(mockNavigationAdapter.navigateTo).toHaveBeenCalledWith(
      '/(tabs)/register/execute-register?moduleID=1' satisfies Href
    );
  });

  it('should call replaceTo with register home route on goToRegisterHome', () => {
    const { result } = renderHook(() =>
      useNavigation({ navigationAdapter: mockNavigationAdapter })
    );

    result.current.goToRegisterHome();

    expect(mockNavigationAdapter.replaceTo).toHaveBeenCalledWith(
      '/(tabs)/register' satisfies Href
    );
  });
});
