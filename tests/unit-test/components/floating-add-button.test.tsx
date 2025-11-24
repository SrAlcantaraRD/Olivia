import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { FloatingAddButton } from '@/ui/components/floating-add-button';

// Mock del hook useRouter
jest.mock('expo-router');

describe('FloatingAddButton', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('should render correctly', () => {
    const { getByRole } = render(<FloatingAddButton />);
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should navigate to add screen when pressed', () => {
    const { getByRole } = render(<FloatingAddButton />);
    const button = getByRole('button');

    fireEvent.press(button);

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/add');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling', () => {
    const { getByRole } = render(<FloatingAddButton />);
    const button = getByRole('button');

    expect(button.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
          width: 70,
          height: 70,
          borderRadius: 35,
        }),
      ])
    );
  });

  it('should apply pressed state styles when pressed', () => {
    const { getByRole } = render(<FloatingAddButton />);
    const button = getByRole('button');

    // Simular el estado pressed
    fireEvent(button, 'pressIn');

    // Verificar que se aplicaron los estilos de pressed
    expect(button.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: expect.any(Number),
        }),
      ])
    );
  });
});
