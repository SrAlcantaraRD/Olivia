---
applyTo: 'src/**/*.tsx'
description: "Rules for implementing UI components following Atomic Design with HeroUI"
---

# UI Components Instructions

## Purpose
Organize and implement UI components scalably using Atomic Design principles with HeroUI base components, ensuring accessibility, internationalization, and consistent theming.

## Artifacts
- `src/ui/components/particle/*.particle.tsx`
- `src/ui/components/atom/*.atom.tsx`
- `src/ui/components/molecule/*.molecule.tsx`
- `src/ui/components/organism/*.organism.tsx`
- `src/ui/components/form/*.form.tsx`
- `src/ui/components/layout/*.layout.tsx`
- `test/unit-test/ui/component/**/*.spec.tsx`

## Naming
- Particles: `<Component>Particle.particle.tsx` (e.g., `toast-particle.particle.tsx`)
- Atoms: `<Component>Atom.atom.tsx` (e.g., `button-atom.atom.tsx`)
- Molecules: `<Component>Molecule.molecule.tsx` (e.g., `form-field.molecule.tsx`)
- Organisms: `<Component>Organism.organism.tsx` (e.g., `parent-setup-form.organism.tsx`)
- Forms: `<Feature>Form.form.tsx` (e.g., `register-form.form.tsx`)
- Layouts: `<Feature>Layout.layout.tsx` (e.g., `main-layout.layout.tsx`)

## Rules

### Atomic Design Structure
- **Particles**: Transversal components used across the app (e.g., toasts, modals)
- **Atoms**: Basic wrappers around heroui-native components, single purpose, highly reusable
- **Molecules**: Combine atoms into functional units (e.g., form fields, buttons with labels)
- **Organisms**: Complex sections combining molecules (e.g., full forms, navigation sections)


### Component Implementation

#### Particles Layer
- Transversal components: Toast, Modal, LoadingSpinner
- Used across different parts of the app
- Consistent behavior and styling

#### Atoms Layer
- Wrap heroui-native components with consistent styling
- Apply TailwindCSS via uniwind integration
- Use compound components and slot-based composition
- Implement Typography variants: Title, Subtitle, Heading, Paragraph, Small
- Create ButtonAtom with rounded-lg default styling
- Build CardAtom, TextFieldAtom (with icons), SpinnerAtom
- TestID pattern: `${props.testID}.<component>.<part?>.atom` (e.g., `button.atom`, `text-field.input.atom`)

#### Molecules Layer
- Combine multiple atoms into functional units
- Examples: FormField (TextFieldAtom + Typography), FormWizard (steps + navigation)
- Handle state management between atoms
- Implement validation display
- TestID pattern: `${props.testID}.<component>.<part?>.molecule`

#### Organisms Layer
- Combine molecules into complex sections
- Examples: ParentSetupForm, RegisterScreen sections
- Manage complex state and business logic presentation
- Coordinate between multiple molecules
- TestID pattern: `${props.testID}.<component>.<part?>.organism`

### Form Components
- Create form components for complex forms
- Use controlled components for form fields
- Implement validation and error display
- Examples: RegisterForm, ParentSetupForm
- Integrate with hooks for state management
- TestID pattern: `${props.testID}.<component>.<part?>.form`

### HeroUI Integration
- Use heroui-native as base components only in atoms layer
- Apply consistent theming aligned with app design
- Leverage compound components: `Button.Label`, `TextField.Input`, `Card.Body`
- Use slot-based composition: `TextField.InputStartContent`, `TextField.InputEndContent`
- Import heroui-native only in atoms layer

### Styling and Theming
- Integrate TailwindCSS via uniwind wrapper: `withUniwind(Component)`
- Apply consistent styling patterns (rounded-lg for buttons)
- Use design tokens for colors, spacing, typography
- Ensure responsive design principles

### Internationalization
- All text uses i18n keys, never hardcoded strings
- Typography atoms accept `i18nKey` prop for translation
- Use `useAppTranslation` hook for custom translation needs
- Keys follow flat dot notation: `page.register.title`

### Accessibility
- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Use `accessibilityHint` for complex interactions
- Implement `accessibilityState` for checkboxes, radios, toggles
- Minimum touch targets: 44x44pt (iOS), 48x48dp (Android)
- Test with VoiceOver (iOS) / TalkBack (Android)

### User Experience
- Haptic feedback on interactions using `expo-haptics`
- Smooth animations with `react-native-reanimated`
- Loading states, error boundaries, optimistic updates
- Form validation with real-time feedback

### Quality Gates
- No heroui-native imports outside atoms layer
- No hardcoded strings in components
- All interactive elements are accessible
- **All components must have a required `testID` prop**
- Components follow Atomic Design hierarchy
- Codacy scan passes without issues

### Do / Avoid
| Do | Avoid |
|----|-------|
| Follow Atomic Design hierarchy | Skip hierarchy levels |
| Import heroui only in atoms | Use heroui in molecules/organisms |
| Use i18nKey on Typography atoms | Hardcode strings in components |
| Implement accessibility props | Skip accessibility requirements |
| Use uniwind for TailwindCSS | Inline Tailwind classes |
| **Always include required `testID` prop** | Skip testID in components |
| Test with screen readers | Assume keyboard-only navigation |

## Testing
- Unit test atoms for correct prop handling and rendering
- Test molecules for atom integration and state management
- Integration test organisms for complex interactions
- Accessibility testing with screen readers
- Visual regression testing for UI consistency
- **Add testID for all components** to facilitate testing with this pattern: `screen.<screen>.<section>.<element>.<part?>` (e.g., `screen.caregiver-setup.confirm-link.welcome-button`)
- Append component-specific suffixes in atoms (e.g., `button.atom`)

### Example
```typescript
// src/ui/atoms/button.atom.tsx (ATOM)
import { Button } from 'heroui-native';
import { withUniwind } from '@/ui/styles/uniwind';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface ButtonAtomProps {
  title: Ti18nKeys;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  testID: string;
}

const ButtonAtomBase: React.FC<ButtonAtomProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  testID,
}) => {
  return (
    <Button
      variant={variant}
      className="rounded-lg"
      onPress={onPress}
      isLoading={isLoading}
      accessibilityLabel={title}
      accessibilityRole="button"
      testID={`${testID}.button.atom`}
    >
      <Button.Label i18nKey={title} />
    </Button>
  );
};

export const ButtonAtom = withUniwind(ButtonAtomBase);

// src/ui/molecules/form-field.molecule.tsx (MOLECULE)
import { TypographySmall } from './typography.atom';
import { TextFieldAtom } from './text-field.atom';

interface FormFieldProps {
  label: Ti18nKeys;
  placeholder: Ti18nKeys;
  value: string;
  onChangeText: (text: string) => void;
  error?: Ti18nKeys;
  required?: boolean;
  testID: string;
}

export const FormFieldMolecule: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  required = false,
  testID,
}) => {
  return (
    <View className="mb-4">
      <TypographySmall
        i18nKey={label}
        className={required ? 'text-red-500' : 'text-gray-700'}
        testID={`${testID}.form-field.label`}
      />
      <TextFieldAtom
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        isRequired={required}
        className="mt-1"
        testID={`${testID}.form-field.input`}
      />
      {error && (
        <TypographySmall
          i18nKey={error}
          className="text-red-500 mt-1"
          testID={`${testID}.form-field.error`}
        />
      )}
    </View>
  );
};

// src/ui/organisms/login-form.organism.tsx (ORGANISM)
import { useState } from 'react';
import { View } from 'react-native';
import { ButtonAtom } from '../atoms/button.atom';
import { FormFieldMolecule } from '../molecules/form-field.molecule';
import { TypographyTitle } from '../atoms/typography.atom';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  testID: string;
}

export const LoginFormOrganism: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  testID,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(email, password);
  };

  return (
    <View className="p-6 bg-white rounded-lg shadow-md">
      <TypographyTitle
        i18nKey="auth.login.title"
        className="mb-6 text-center"
        testID={`${testID}.login-form.title`}
      />

      <FormFieldMolecule
        label="auth.login.email"
        placeholder="auth.login.email_placeholder"
        value={email}
        onChangeText={setEmail}
        required
        testID={`${testID}.login-form.email`}
      />

      <FormFieldMolecule
        label="auth.login.password"
        placeholder="auth.login.password_placeholder"
        value={password}
        onChangeText={setPassword}
        testID={`${testID}.login-form.password`}
        required
      />

      <ButtonAtom
        title="auth.login.submit"
        onPress={handleSubmit}
        isLoading={isLoading}
        className="mt-4"
        testID={`${testID}.login-form.submit`}
      />
    </View>
  );
};
```
