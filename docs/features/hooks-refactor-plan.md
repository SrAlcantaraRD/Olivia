## Plan de refactorizacion - Hooks

Fecha: 2025-12-18

Objetivo
- Reducir duplicacion en hooks de todo el proyecto.
- Centralizar manejo de loading, errores y persistencia en `useListStore`.

Motivacion
- Hooks actuales repiten: start/stop loading, notify error, saveItems.
- Un wrapper unifica el flujo y evita inconsistencias.

Propuesta
- Crear `useExecuteUseCase` para estandarizar la ejecucion de use-cases.
- Usarlo en hooks y luego en el resto de hooks del domain.

Alcance inicial
- Hooks en `src/**/hook/*`.
- Hooks de module, carer, patient y core.

Especificacion del wrapper
- Firma propuesta:
  - `useExecuteUseCase<TRequest, TResponse>(options)`
- Inputs:
  - `useCaseFactory` (crea el use-case con adapters)
  - `onSuccess` (callback para guardar en store)
  - `onError` (callback opcional)
  - `storeKey` (entity key en `useListStore`)
- Outputs:
  - `execute`, `isExecuting`, `data:<TResponse>`, `error`

Criterios de aceptacion
- Menos codigo duplicado en hooks del proyecto.
- Mismo comportamiento actual (notify + loading + saveItems).
- Tests existentes siguen pasando.

Pendiente
- Definir ubicacion final del wrapper (probable: `src/domain/core/hook/use-execute-use-case.hook.ts`).
- Migrar hooks del proyecto por fases.
