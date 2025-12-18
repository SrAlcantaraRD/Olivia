import { render as rtlRender } from '@testing-library/react-native';

// Re-export everything from RNTL
export * from '@testing-library/react-native';

// Custom render function for UI tests
// This provides a consistent setup with common providers
export const render = rtlRender;
