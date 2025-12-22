---
applyTo: 'src/ui/**/*.tsx,src/app/**/*.tsx,src/ui/**/*.ts,src/app/**/*.ts'
description: "Rules for internationalization in UI components"
---

# UI i18n Instructions

## Purpose
Ensure all text in UI components is properly internationalized using i18next with type-safe keys.

## Artifacts
- `src/{ui|app}/**/*.{tsx|ts}` (components using i18n)
- Typography atom components with i18n support
- Custom hooks for translation in components

## Naming
- Components: Standard React naming conventions
- i18n keys: Flat dot notation (e.g., `page.register.title`, `ui.component.<atom|molecule|etc>.<>`)

## Rules

### Component Integration
- All text content must use i18n keys, never hardcoded strings
- Typography atoms accept `i18nKey` prop for automatic translation

### Key Formatting
- Use flat dictionary structure with dot notation
- Follow pattern: `{section}.{page}.{element}.{action?}.{variant?}`
- Examples: `page.register.title`, `page.sign-up.button.on-sign-up`,
`page.sign-up.form.title`, `page.sign-up.form.input.email.placeholder`

### Typography Components
- `TypographyTitle`, `TypographySubtitle`, `TypographyHeading`
- `TypographyParagraph`, `TypographySmall`
- All accept `i18nKey` prop for translation

### Error Prevention
- Never pass hardcoded strings to components
- Always verify keys exist in locale files
- Use TypeScript for key validation

### Updates and Maintenance
- Add new keys to all locale files simultaneously
- Update components when keys change
- Test translations in multiple languages

### Quality Gates
- No hardcoded strings in JSX or component logic
- All `i18nKey` props reference valid keys
- Components render correctly in all supported languages
- Codacy scan passes without hardcoded string warnings

### Do / Avoid
| Do | Avoid |
|----|-------|
| Use `i18nKey` prop or Typography atoms | Hardcode strings in components |
| Import from `@/i18n` utilities | Use `t()` directly in components |
| Update all locale files for new keys | Skip locale updates |
| Test with multiple languages | Assume English-only usage |
| Use flat dot notation | Nested object structures |
| Add keys to all locale files | Use invalid/non-existent keys |

## Testing
- Verify components render translated text correctly
- Test with different locales to ensure completeness
- Mock translation hooks in unit tests
- Check for hardcoded strings in component code

### Example
```typescript
// src/ui/components/screens/register.screen.tsx
import { TypographyTitle } from '@/ui/components/atoms/typography.atom';
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';

export const RegisterScreen: React.FC = () => {
  return (
    <View className="flex-1 p-4">
      {/* ✅ Correct: Using i18nKey prop */}
      <TypographyTitle
        i18nKey="page.register.title"
      />

      <TypographyParagraph
        i18nKey="page.register.subtitle"
      />

      {/* ✅ Correct: Button with translated label */}
      <ButtonAtom
        title="common.save"
        onPress={handleSave}
      />
    </View>
  );
};
```
