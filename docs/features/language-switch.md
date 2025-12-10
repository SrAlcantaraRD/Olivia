# Language Switch (Cambio de Idioma)

## Objetivo
Permitir al usuario cambiar el idioma de la aplicación y persistir la elección entre sesiones.

## Comportamiento en tiempo de ejecución
- Al arrancar, `SettingsProvider` lee la clave `APP_LOCALE` y, si existe, llama `i18n.changeLanguage(...)` con el código guardado.
- La UI de Ajustes expone las opciones de idioma usando `ELocaleCode` (códigos largos: `en-EN`, `es-ES`, `ca-CA`).
- Al seleccionar un idioma, se aplica inmediatamente con `i18n.changeLanguage(...)` y se persiste usando `SetAppLocaleUseCase`.

## Persistencia
- Clave en cache: `APP_LOCALE` (definida en `src/domain/core/port/cache.port.ts`).
- Valores: `ELocaleCode` (enum en `src/domain/core/enum/settings.enum.ts`) — usa códigos largos para mayor claridad internacional.
- Adapter: `ICachePort` (ej. SecureStore) implementado en `src/adapter/index.ts`.

## Artefactos de código relevantes
- Use-cases:
  - `src/domain/core/use-case/get-app-locale.use-case.ts`
  - `src/domain/core/use-case/set-app-locale.use-case.ts`
- Hook / provider:
  - `src/domain/core/hook/use-app-settings.hook.ts`
  - `src/ui/context/settings.context.tsx`
- UI:
  - `src/app/(tabs)/settings/app-settings.tsx` (selector de idioma)
  - `src/ui/components/atoms/language-select.*` (si existe; de lo contrario el selector está en `app-settings.tsx`)
- i18n:
  - `src/ui/i18n/i18n.ts` (mapea recursos a códigos largos)
  - Recursos de idioma: `src/ui/i18n/locales/en-EN.ts`, `es-ES.ts`, `ca-CA.ts`
- Tests:
  - `tests/unit-test/domain/core/use-case/get-set-app-locale.use-case.spec.ts`
  - `tests/unit-test/hooks/use-app-settings.hook.spec.ts` (cubre el efecto de init y cambio)

## Cómo añadir un nuevo idioma
1. Añadir archivo de recursos en `src/ui/i18n/locales/` (p. ej. `fr-FR.ts`).
2. Añadir el mapeo en `src/ui/i18n/i18n.ts` apuntando a la nueva entrada.
3. Añadir el valor correspondiente en `ELocaleCode`.
4. Añadir las claves de traducción necesarias y actualizar la UI si hace falta.

## Notas y consideraciones
- Usamos códigos largos (`en-EN`) para evitar ambigüedad entre variantes regionales.
- Cambiar el idioma aplica inmediatamente; persistimos la elección de forma asíncrona.
- Asegurarse de que todas las cadenas visibles en UI usan `TextTranslation` y no textos hardcodeados.

---
Documentado por la implementación de Application Settings (Cambio de Idioma).
