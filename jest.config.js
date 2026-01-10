module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|react-native-reanimated|uniwind|heroui-native)',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: [
    '<rootDir>/tests/unit-test/**/*.test.{ts,tsx}',
    '<rootDir>/tests/unit-test/**/*.spec.{ts,tsx}',
    '<rootDir>/tests/integration/**/*.spec.{ts,tsx}',
  ],
  cache: true,
  collectCoverageFrom: [
    'src/app/**/*.{ts,tsx}',
    'src/ui/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/constants/**/*.{ts,tsx}',
    'src/domain/**/{hooks,use-case,enum,error,use-case-schema}/*.{ts,tsx}',
    'src/database/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/i18n$': '<rootDir>/src/ui/i18n/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-vector-icons$': '@expo/vector-icons',
    '^react-native-vector-icons/(.*)': '@expo/vector-icons/$1',
    'expo/src/winter': '<rootDir>/tests/mocks/empty.ts',
  },
};
