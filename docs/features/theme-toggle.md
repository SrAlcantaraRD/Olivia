# Theme Toggle (Cambio de Tema)

## Objetivo
Permitir al usuario alternar entre tema claro y oscuro en la aplicación y persistir la preferencia para futuros inicios.

## Comportamiento en tiempo de ejecución
- El `SettingsProvider` inicializa los ajustes al arrancar la app leyendo la clave de cache `APP_THEME`.
- Si existe un valor guardado, se aplica inmediatamente con `Uniwind.setTheme(...)` (desde el `AppThemeProvider`).
- El control de interfaz (`ThemeToggle` atom) cambia el tema en runtime y dispara la persistencia mediante el caso de uso `SetAppThemeUseCase`.

## Persistencia
- Clave en cache: `APP_THEME` (definida en `src/domain/core/port/cache.port.ts`).
- Valores: `EThemeMode.LIGHT` / `EThemeMode.DARK` (enum en `src/domain/core/enum/settings.enum.ts`).
- Adapter usado: implementación de `ICachePort` (ej. SecureStore) definida en `src/adapter/index.ts`.

## Artefactos de código relevantes
- Use-cases:
  - `src/domain/core/use-case/get-app-theme.use-case.ts`
  - `src/domain/core/use-case/set-app-theme.use-case.ts`
- Hook / provider:
  - `src/domain/core/hook/use-app-settings.hook.ts` (API para leer/guardar y aplicar cambios)
  - `src/ui/context/settings.context.tsx` (llama `initSettings()` en montaje)
- UI:
  - `src/ui/components/atoms/theme-toggle.atom.tsx` (control en header)
  - `src/app/(tabs)/settings/app-settings.tsx` (opción en pantalla de ajustes)
- Tests:
  - `tests/unit-test/ui/theme-toggle.spec.tsx`
  - `tests/unit-test/domain/core/use-case/get-set-app-theme.use-case.spec.ts`

## Buenas prácticas / notas de implementación
- Cambiar el tema aplica inmediatamente la apariencia sin esperar a la persistencia.
- Siempre usar `EThemeMode` en UI y dominio para evitar strings mágicos.
- Para añadir más modos (p. ej. `system`):
  1. Añadir la opción al enum `EThemeMode`.
  2. Extender `AppThemeProvider` para soportar la lógica correspondiente.
  3. Asegurarse de migrar/transformar cualquier valor existente en cache si cambia la representación.

## Traducciones / i18n
- Textos usados en la UI están en `src/ui/i18n/locales/*` y referenciados desde `TextTranslation` en los componentes.

---
Documentado por la implementación de Application Settings (Tema).
