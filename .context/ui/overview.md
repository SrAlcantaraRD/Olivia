# Design tokens, component architecture, accessibility

The Oliva app uses HeroUI as the design system foundation with custom atomic components and strict accessibility standards.

## Design token system

### Color palette

```typescript
// src/ui/theme/colors.ts
export const colors = {
  // Primary brand colors
  primary: {
    50: '#e6f3ff',
    100: '#cce7ff',
    500: '#0066cc', // Main blue
    900: '#003366',
  },

  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    900: '#111827',
  },

  // Medical-specific colors
  medical: {
    urine: '#fbbf24', // Yellow for urine records
    catheter: '#8b5cf6', // Purple for catheter procedures
    hygiene: '#06b6d4', // Cyan for hygiene tasks
  },
} as const;
```

### Typography scale

```typescript
// src/ui/theme/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;
```

### Spacing and layout

```typescript
// src/ui/theme/spacing.ts
export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  24: '6rem',     // 96px
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;
```

## Component architecture

### Atomic design pattern

```
Atoms (基础组件)
├── Typography (文本)
├── Button (按钮)
├── Input (输入框)
├── Icon (图标)
└── Badge (徽章)

Molecules (复合组件)
├── FormField (表单字段)
├── Card (卡片)
├── ListItem (列表项)
└── NavigationBar (导航栏)

Organisms (页面组件)
├── RecordForm (记录表单)
├── PatientList (患者列表)
├── Dashboard (仪表板)
└── SettingsPanel (设置面板)

Templates (页面模板)
├── RecordTemplate (记录页面模板)
├── ListTemplate (列表页面模板)
└── FormTemplate (表单页面模板)

Pages (完整页面)
├── HomePage (首页)
├── RecordPage (记录页面)
└── SettingsPage (设置页面)
```

### Component implementation

```typescript
// src/ui/components/atoms/Button.atom.tsx
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

interface ButtonProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const StyledTouchable = styled(TouchableOpacity);

export function Button({
  children,
  variant = 'primary',
  size = 'md',
- **Legal**: Healthcare applications have accessibility requirements
- **User experience**: Better usability for all users

Trade-off: Development time and complexity increase.

### Why custom design tokens?

- **Brand consistency**: Unique medical app identity
- **Flexibility**: Easy to update colors and spacing
- **Type safety**: TypeScript ensures valid token usage

Trade-off: Additional setup and maintenance.

### Why light/dark theme support?

- **User preference**: Respect system theme settings
- **Accessibility**: Better contrast options for different users
- **Modern UX**: Expected in mobile applications

Trade-off: Double the styling work and testing complexity.
