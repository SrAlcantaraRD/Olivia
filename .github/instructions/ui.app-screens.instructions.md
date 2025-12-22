---
applyTo: 'src/app/**/*'
description: "Rules for implementing Expo Router screens in the Oliva App"
---

# App Screens Instructions

## Purpose
Organize and implement Expo Router screens scalably, orchestrating hooks and UI components while following navigation patterns, ensuring accessibility, internationalization, and consistent user experience.

## Artifacts
- `src/app/_layout.tsx` - Root layout configuration
- `src/app/index.tsx` - Splash screen
- `src/app/modal.tsx` - Modal stack configuration
- `src/app/(onboarding)/**/*.tsx` - Onboarding flow screens and layouts
- `src/app/(caregiver-setup)/**/*.tsx` - Caregiver setup screens and layouts
- `src/app/(tabs)/**/*.tsx` - Tab-based screens and layouts
- `test/e2e/**/*.spec.ts` - E2E tests for screen flows

## Naming
- Root Screens: `index.tsx`, `modal.tsx`
- Layouts: `_layout.tsx` in each route group
- Feature Screens: `<feature>.tsx` (e.g., `parent-setup.tsx`, `confirm-link.tsx`)
- Route Groups: Use parentheses for organization `(onboarding)`, `(tabs)``
- Modal Screens: `modal-<feature>.tsx` (e.g., `execute-register.tsx`)

## Rules

### Expo Router Structure
- **Root Layout**: Configure global navigation options in `_layout.tsx`
- **Route Groups**: Use parentheses for logical grouping (onboarding, tabs, modals)
- **Layouts**: Each route group has its own `_layout.tsx` for specific navigation config
- **Screens**: Default export functions named after the screen purpose

### Screen Implementation
- Import and use `useAdapters` hook for dependency injection
- Use semantic navigation hooks like `useNavigation` for route transitions
- Orchestrate business logic through custom hooks (e.g., `useSplashCarerValidation`)
- Render UI components (atoms, molecules, organisms, forms) with proper props
- Handle local state with `useState` for UI interactions
- Use `useEffect` for side effects like data loading or animations

### Layout Configuration
- Use `Stack` from `expo-router` for stack navigation
- Use `Tabs` for tab-based navigation
- Configure `screenOptions` for consistent headers, gestures, etc.
- Set `headerShown: false` for custom navigation UI
- Define specific screen options in `Stack.Screen` or `Tabs.Screen`

### Navigation Patterns
- Use semantic methods from `useNavigation` hook instead of direct router calls
- Handle back navigation with `goBack()` method
- Pass route parameters through navigation methods when needed
- Implement loading states during navigation transitions

### State Management
- Use local state for UI-specific interactions (selected items, form inputs)
- Delegate business logic to hooks that orchestrate use-cases
- Handle async operations with loading states and error handling
- Use `useRef` for animations and persistent references

### UI Integration
- Import UI components from `@/ui/components/`
- Pass required `testID` props following pattern: `screen.<section>.<page>.<element>`
- Use i18n keys for all text content
- Ensure accessibility props on interactive elements
- Apply consistent styling with TailwindCSS classes

### Modal Screens
- Use `presentation: 'modal'` in layout configuration
- Handle modal dismissal with navigation methods
- Implement form validation and submission in modals

### Tab Screens
- Organize tab screens in `(tabs)` route group
- Use `Tabs` layout for bottom tab navigation
- Configure tab icons, labels, and accessibility
- Handle tab switching with navigation hooks

### Error Handling
- Use try-catch blocks for async operations
- Display errors through notification adapters
- Implement fallback UI for error states
- Log errors using domain logger adapters

### Performance Considerations
- Use `React.memo` for screens with expensive renders
- Implement proper key props for lists
- Avoid unnecessary re-renders with `useCallback` and `useMemo`
- Lazy load heavy components when possible

### Quality Gates
- All screens use `useAdapters` for dependency injection
- Navigation uses semantic methods from hooks
- UI components receive required `testID` props
- No hardcoded strings in screen components
- Accessibility roles and labels implemented
- Codacy scan passes without issues

### Do / Avoid
| Do | Avoid |
|----|-------|
| Use semantic navigation hooks | Direct expo-router imports |
| Orchestrate logic through custom hooks | Business logic in screen components |
| Pass testID to all UI components | Skip accessibility implementation |
| Use route groups for organization | Flat file structure |
| Handle loading and error states | Silent failures |
| Follow Expo Router conventions | Custom navigation solutions |

## Testing
- E2E tests for critical user flows using Detox
- Component integration tests for screen rendering
- Mock adapters and hooks for isolated testing
- Test navigation transitions and state changes
- Accessibility testing with screen readers
- Visual regression testing for UI consistency
