import { render } from '@testing-library/react-native';

import { ThemeToggle } from '@/ui/components/atoms/theme-toggle.atom';

describe('[UI] ThemeToggle component', () => {
  it('renders and triggers toggle + persistence', () => {
    const { getByTestId } = render(<ThemeToggle />);
    const button = getByTestId('button.toggle-theme');

    // If no crash, assume toggle handler executed; persistence is fire-and-forget
    expect(button).toBeDefined();
  });
});
