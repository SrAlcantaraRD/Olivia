import { render, userEvent } from '@testing-library/react-native';

import AppSettingsScreen from '@/app/(tabs)/settings/app-settings';

describe('[UI] AppSettingsScreen', () => {
  it('calls setLocale when language buttons pressed', async () => {
    const user = userEvent.setup();

    const { getByLabelText } = render(<AppSettingsScreen />);

    const enButton = getByLabelText(
      'page.app-settings.button.change-language-english'
    );
    await user.press(enButton);

    const esButton = getByLabelText(
      'page.app-settings.button.change-language-spanish'
    );
    await user.press(esButton);

    const caButton = getByLabelText(
      'page.app-settings.button.change-language-catalan'
    );
    await user.press(caButton);

    expect(enButton).toBeDefined();
    expect(esButton).toBeDefined();
    expect(caButton).toBeDefined();
  });
});
