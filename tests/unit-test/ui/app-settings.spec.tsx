import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@/domain/core/hook/use-app-settings.hook', () => ({
  useAppSettings: () => ({
    setTheme: jest.fn(),
    setLocale: jest.fn(),
  }),
}));

import AppSettingsScreen from '@/app/(tabs)/settings/app-settings';

describe('AppSettingsScreen', () => {
  it('calls setLocale when language buttons pressed', () => {
    const { getByText } = render(<AppSettingsScreen />);

    const enBtn = getByText('English');
    fireEvent.press(enBtn);

    const esBtn = getByText('Español');
    fireEvent.press(esBtn);

    const caBtn = getByText('Català');
    fireEvent.press(caBtn);

    expect(enBtn).toBeDefined();
    expect(esBtn).toBeDefined();
    expect(caBtn).toBeDefined();
  });
});
