# Feature: Borrado local al "Log Out"

## Resumen

- **Descripción**: al confirmar "Borrar" en la pantalla de configuración, la app borra todos los datos locales del perfil en este dispositivo (cache, secure store y BBDD local). Es una acción irreversible.
- **Wireframe**: [docs/wireframe-screens/settings/log-out.screen-wireframe.md](docs/wireframe-screens/settings/log-out.screen-wireframe.md)

## Flujo de la funcionalidad

- `Press Log Out (Confirmar Borrar)` → `Hook` → `Use Case` → limpieza local → notificación y navegación a pantalla principal.
- Flujo concreto implementado: confirm-button → `useWipeLocalData` (hook) → `WipeLocalDataUseCase` (use-case) → `dropDatabase()` + borrado de claves en `cache` y `secureStore`.

## Cambios principales (archivos añadidos / modificados)

- Nueva pantalla / llamada desde Settings:
  - `src/app/(tabs)/settings/log-out.tsx` (nueva pantalla de confirmación; llama al hook)
- Use case:
  - `src/domain/core/use-case/wipe-local-data.use-case.ts` (nuevo)
- Hook:
  - `src/domain/core/hook/use-wipe-local-data.hook.ts` (nuevo)
- Adaptadores / utilidades usadas:
  - `src/database/config/drop-database.config.ts` (se reutiliza para truncar tablas)
  - `src/adapter/index.ts` (los adapters se inyectan desde `useAdapters` en runtime)
- I18n:
  - `src/ui/i18n/locales/es-ES.ts` (nuevas claves para la pantalla)
  - `src/ui/i18n/locales/en-EN.ts` (nuevas claves para la pantalla)
- Tests unitarios (nuevos):
  - `tests/unit-test/domain/core/use-case/wipe-local-data.use-case.spec.ts`
  - `tests/unit-test/domain/core/hook/use-wipe-local-data.hook.spec.ts`
  - `tests/unit-test/domain/core/mocks/mock.port.ts` (helpers de mocks centralizados)

## Detalles técnicos

- **WipeLocalDataUseCase**:
  - Recibe `cacheAdapter` y `secureStoreAdapter` (ambos implementan `ICachePort`).
  - Itera sobre `CACHE_KEY_ENUM` y llama a `delete(key)` en ambos adapters.
  - Llama a `dropDatabase()` para eliminar tablas (implementación actual ejecuta `DROP TABLE` por tabla).
  - Maneja errores a nivel de key/table de forma tolerante (no aborta por errores puntuales).

- **useWipeLocalData**:
  - Hook sencillo que expone `execute()` e `isExecuting`.
  - Envuelve el `WipeLocalDataUseCase` y gestiona estado de ejecución.

- **log-out.tsx** (pantalla):
  - Muestra advertencia y resumen agregado (días registrados, totales por módulo, etc.).
  - Al pulsar **Borrar** llama a `execute()` del hook.
  - Si la operación tiene éxito, notifica (`notifyAdapter.success`) y hace `router.replace('/')` para volver al inicio.
  - Los botones quedan deshabilitados mientras dura la operación.

## Tests

- Se añadieron tests unitarios para el caso de uso y el hook. Se utilizan mocks centralizados (`mockLoggerPort`, `mockCachePort`, `mockSecureStorePort`) ubicados en `tests/unit-test/domain/core/mocks/mock.port.ts`.
- `dropDatabase` se mockea en los tests para evitar tocar la BBDD real.

## Cómo ejecutar los tests (local)

Usa `pnpm` como gestor (repositorio ya configurado):

```bash
# Ejecuta todos los tests
pnpm test

# Ejecutar sólo los tests añadidos (ejemplo con jest)
npx jest tests/unit-test/domain/core/use-case/wipe-local-data.use-case.spec.ts
npx jest tests/unit-test/domain/core/hook/use-wipe-local-data.hook.spec.ts
```

## Notas y recomendaciones

- Acción destructiva: esta funcionalidad borra TODO local. Antes de usarla en producción, considerar:
  - Añadir confirmación adicional (por ejemplo, pedir que el usuario escriba `BORRAR` para validar).
  - Posibilidad de exportar/backup previo (si el producto lo requiere).
  - Asegurar que no quedan credenciales o tokens en servicios externos (si existieran, revocar o cerrar sesión).
- E2E: los tests de extremo a extremo quedan pendientes. Recomiendo crear un E2E que simule el flujo y verifique que la base de datos queda vacía.
