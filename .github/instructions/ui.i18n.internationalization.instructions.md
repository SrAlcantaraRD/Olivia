---
applyTo: 'src/ui/i18n/**/*.ts'
description: "Rules for internationalization using i18next with type-safe keys"
---

# Internationalization Instructions

## Purpose
Provide automatic translation with type-safety via Ti18nKeys using i18next + react-i18next for all UI text and messages.

## Artifacts
- `src/ui/i18n/i18n.ts`
- `src/ui/i18n/locales/*.ts`

## Naming
- Config: `i18n.ts`
- Locales: `{locale}.ts` (e.g., `en-EN.ts`, `es-ES.ts`)
- Hooks: `use-{feature}.hook.ts`
- Types: `Ti18nKeys` for type-safe keys

## Rules

### Setup and Configuration
- Initialize i18n with resources, default language 'en', and fallback 'en'
- Configure interpolation, formatting, and language detection
- Use flat dictionary structure with dot notation for keys

### Integration
- Import i18n config in `_layout.tsx`
- Wrap app with `I18nextProvider` for React integration

### Key Management
- Use flat dictionary with dot notation: `'page.register.title'`
- Generate `Ti18nKeys` type from locale files for autocomplete
- Add new keys to all locale files simultaneously

### Component Usage
- Typography atoms accept `i18nKey` prop for translations
- Never hardcode strings directly in components

### Adapter Integration
- Use `t(key)` function in adapters for notifications and messages
- Ensure error messages are translatable

### Multi-language Support
- Add new locale files (e.g., `es-ES.ts`) with same structure
- Implement language selector in settings
- Test all locales for completeness

### Quality Gates
- No hardcoded strings in UI components
- All translation keys must exist in locale files
- TypeScript autocomplete works for all keys
- Codacy scan passes without i18n issues

### Do / Avoid
| Do | Avoid |
|----|-------|
| Add keys to all locale files | Use invalid/non-existent keys |
| Use flat dot notation | Nested object structures |
| Test with multiple locales | Skip locale updates |

## Testing
- Mock `react-i18next` in unit tests
- Verify translation keys exist and render correctly
- Test language switching functionality
- Ensure no hardcoded strings in components
