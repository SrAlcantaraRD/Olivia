// Mock de expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: 'Link',
  Stack: {
    Screen: 'Screen',
  },
  Tabs: {
    Screen: 'Screen',
  },
}));

// Mock de react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock de heroui-native
jest.mock('heroui-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const StubComponent = ({ children, ...props }: Record<string, unknown>) =>
    React.createElement(View, props, children);
  const PressableFeedback = Object.assign(StubComponent, {
    Ripple: StubComponent,
  });

  return {
    __esModule: true,
    useThemeColor: jest.fn(() => '#000000'),
    useGlobalAnimationSettings: jest.fn(() => ({
      globalIsAllAnimationsDisabled: false,
    })),
    HeroUINativeProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    Avatar: StubComponent,
    Chip: StubComponent,
    Card: StubComponent,
    Button: StubComponent,
    Divider: StubComponent,
    Separator: StubComponent,
    PressableFeedback,
    TextField: StubComponent,
    Input: StubComponent,
    Label: StubComponent,
    Description: StubComponent,
    FieldError: StubComponent,
    Spinner: StubComponent,
    TypographySmall: StubComponent,
  };
});

// Mock de react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');

  // Silence "useNativeDriver" warning + avoid act() noise from layout animations
  // See: react-native-reanimated Jest setup guidance.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (Reanimated as { default: { call?: () => void } }).default.call = () => {};

  return Reanimated;
});

jest.mock('expo/src/winter/runtime.native.ts', () => ({}));

// Mock de expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    // Mock database object
  })),
}));

// mock dropDatabase to avoid touching real DB
jest.mock('@/database/config/drop-database.config', () => ({
  dropDatabase: jest.fn().mockResolvedValue(undefined),
}));

// Mock de drizzle-orm/expo-sqlite
jest.mock('drizzle-orm/expo-sqlite', () => ({
  drizzle: jest.fn(() => ({
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          limit: jest.fn(() => ({
            all: jest.fn(() => []),
          })),
        })),
      })),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        onConflictDoNothing: jest.fn(() => ({
          execute: jest.fn(),
        })),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          execute: jest.fn(),
        })),
      })),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(() => ({
        execute: jest.fn(),
      })),
    })),
  })),
}));

// Mock de database config
jest.mock('@/database/config/database.config', () => ({
  DB_CLIENT: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          limit: jest.fn(() => ({
            all: jest.fn(() => []),
          })),
        })),
      })),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        onConflictDoNothing: jest.fn(() => ({
          execute: jest.fn(),
        })),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          execute: jest.fn(),
        })),
      })),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(() => ({
        execute: jest.fn(),
      })),
    })),
  },
  SQLITE_DB: {},
  buildAdapterClient: jest.fn(),
}));

// Mock de expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Global test timeout
jest.setTimeout(10000);

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: jest.fn((key) => key),
    i18n: {
      changeLanguage: jest.fn(),
    },
  })),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock TextTranslation to return i18nKey or children
jest.mock('@/ui/components/atoms/text-translations.atom', () => ({
  TextTranslation: jest.fn(({ i18nKey, children }) => i18nKey || children),
}));

// Mock expo modules that require native code
jest.mock('expo-glass-effect', () => ({
  isLiquidGlassAvailable: jest.fn(() => false),
  GlassContainer: 'GlassContainer',
  GlassView: 'GlassView',
}));

// Mock @expo/vector-icons to avoid async font loading (slow + act warnings)
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockIcon = (props: Record<string, unknown>) =>
    React.createElement(View, props);

  return {
    __esModule: true,
    Ionicons: MockIcon,
  };
});

// Mock uniwind exports used in the app (keep it lightweight in tests)
jest.mock('uniwind', () => ({
  Uniwind: {
    setTheme: jest.fn(),
  },
  withUniwind: (Component: unknown) => Component,
}));

// Mock del módulo i18n para evitar inicialización
jest.mock('@/ui/i18n/i18n', () => ({
  __esModule: true,
  default: {
    changeLanguage: jest.fn(),
    language: 'en-EN',
  },
}));

// Mock del contexto de tema (evita crashes cuando un componente usa useAppTheme)
jest.mock('@/ui/themes/app-theme-context', () => ({
  useAppTheme: jest.fn(() => ({
    currentTheme: 'light',
    isLight: true,
    isDark: false,
    setTheme: jest.fn(),
    toggleTheme: jest.fn(),
  })),
  AppThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
