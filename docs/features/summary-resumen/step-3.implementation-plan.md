## Plan de Implementacion Detallado - Resumen (Tab)

Fecha: 2025-12-18

Objetivo
- Implementar la pestaña "Resumen" siguiendo Clean Architecture, con orden de trabajo: Domain -> Adapters -> Use-cases -> Hooks -> UI.

Fuentes
- PRD: `docs/features/summary-resumen/summary-resumen-prd.md`
- PSD: `docs/features/summary-resumen/summary-resumen-psd.md`
- Wireframes: `docs/features/summary-resumen/step-2.wireframe.md`
- Wireframe refinement: `docs/features/summary-resumen/step-3.wireframe-refinement.md`


## Orden de implementacion (macro)
1. Domain (entities -> enums -> ports -> use-cases)
2. Adapters (db/cache/service)
3. Hooks (orquestan domain + adapters)
4. UI (screens -> components -> detalle)
5. QA (tests + validacion manual)




## Fase 0 - Alineacion y setup (0.5 - 1 dia)

0.1 Validar rutas y naming
- Definir rutas finales con Expo Router (summary vs resumen, detail paths).
- Rutas acordadas:
  - `src/app/(tabs)/summary/index.tsx`
  - `src/app/(tabs)/summary/all-data.tsx`
  - `src/app/(tabs)/summary/trends.tsx`
  - `src/app/(tabs)/summary/highlights.tsx`
  - `src/app/(tabs)/summary/detail/module/[moduleId].tsx`
  - `src/app/(tabs)/summary/detail/module/[moduleId]/field/[fieldId].tsx`
  - `src/app/(tabs)/summary/detail/trend/[trendId].tsx`
- Confirmar estructura de carpetas y nomenclatura.
- Aceptacion: rutas definidas y documentadas, no hay ambiguedad.
 - Estado: ✅

0.2 Definir contratos minimos (SummaryModule, SummaryPin, SummaryTrend)
- Validar shape y keys de i18n necesarias.
- Aceptacion: contratos listos para implementar en domain.
 - Estado: ✅

0.3 Mapa de dependencias
- Identificar reuso de `get-active-module-list.use-case.ts` para modulos activos dinamicos.
- Validar flow: hook -> use-case -> adapter -> BBDD (sin acceso directo desde UI).
- Persistencia de pins via `cache.port.ts` (MMKV), sin limite de pins.
- i18n: ES/CA/EN.
- Aceptacion: lista de modulos y fuentes de datos validada.
 - Estado: ✅


## Fase 1 - Domain (1 - 2 dias)

1.1 Entidades y tipos base
- Crear `SummaryModule`, `SummaryField`, `SummaryTrend`, `SummaryPin`, `SummaryPeriod`.
- Aceptacion: types exportados desde `src/domain/summary` sin errores TS.
 - Estado: ✅

1.2 Enums y constantes
- Periodos: Day, Week, Month, HalfYear, Year.
- Pin types: module, field, trend.
- Aceptacion: enums usados por use-cases y hooks.
 - Estado: ✅

1.3 Ports (interfaces)
- `SummaryModulePort`: read module summaries (today, last7, averages).
- `SummaryDetailPort`: read detail data (module/field/trend).
- `SummaryTrendPort`: list trends.
- `SummaryHighlightPort`: list highlights.
- `SummaryPinsPort`: CRUD + ordering.
- `SummaryAnalysisPort`: generateAnalysis placeholder.
- `SummarySnapshotPort`: get/set snapshots en cache (sin TTL).
- Aceptacion: ports cubren necesidades del PSD.
 - Estado: ✅

1.4 Use-cases
- `GetSummaryHomeUseCase` (cards + pinned section).
- `GetSummaryModulesUseCase` (all-data list).
- `GetSummaryTrendsUseCase` (trends list).
- `GetSummaryHighlightsUseCase` (highlights list).
- `GetSummaryDetailUseCase` (detail template data by type).
- `PinSummaryItemUseCase`, `UnpinSummaryItemUseCase`, `ReorderSummaryPinsUseCase`.
- `RefreshSummarySnapshotsUseCase` (recalcula y guarda snapshots).
- Aceptacion: use-cases retornan domain-only models, sin dependencias UI.
 - Estado: ✅


## Fase 2 - Adapters (1 - 2 dias)

2.0 FakeData adapters (temporales)
- `FakeData<entity>Adapter` implementa cada `Summary*Port`.
- Objetivo: desbloquear UI sin tocar cache/BBDD.
- Aceptacion: hooks funcionan con datos mock.
 - Estado: ✅

2.1 Data adapter (query/aggregation)
- Implementar adapters por entidad usando Drizzle y/o `use-report-manager`.
- Agregados minimos: todayCount, last7Days, previousPeriodAverage.
- Aceptacion: adapter retorna datos reales o fallback seguro.

2.2 Cache/Pins adapter
- Implementar adapter MMKV o secure-store para pins.
- Soporte: create, remove, list, reorder.
- Aceptacion: persiste y recupera orden correctamente.

2.3 Analysis adapter (placeholder)
- Implementar `aiAnalysis.stub.ts` y port.
- Aceptacion: retorna texto placeholder estable.

2.4 Summary snapshot adapter (PRO, sin TTL)
- Implementar almacenamiento de snapshots (cache) con `cache.port.ts`.
- El snapshot se actualiza solo via use-case (sin TTL automatico).
- Aceptacion: snapshots guardados y leidos de cache sin expiracion.
 - Nota: se define la logica y contratos ahora; la implementacion queda para el final.


## Fase 3 - Hooks (1 - 2 dias)

3.1 Hook de home
- `use-summary-home.hook.ts`: cards + pinned section.
- Manejar loading/empty/error.
- Aceptacion: hook usable por `summary/index`.
 - Estado: ✅

3.2 Hook de listados
- `use-summary-modules.hook.ts` (all-data).
- `use-summary-trends.hook.ts`.
- `use-summary-highlights.hook.ts`.
- Aceptacion: datos mock/real inyectables.
 - Estado: ✅

3.3 Hook de detalle
- `use-summary-detail.hook.ts`: data, period selector, analysis.
- Aceptacion: soporta module/field/trend con un shape comun.
 - Estado: ✅

3.4 Hook de pins
- `use-summary-pins.hook.ts`: pin/unpin/reorder.
- Aceptacion: cambios reflejados en home.
 - Estado: ✅

3.5 Hook de refresh
- `use-summary-refresh.hook.ts`: ejecuta refresh manual (pull-to-refresh, entry).
- Aceptacion: dispara el recalculo de snapshots sin TTL.
 - Nota: hook y use-case quedaran como skeletons con mocks hasta la fase final.
 - Estado: ⏳
 - TODO: renombrar `refresh-summary-snapshots.hook.ts` a `use-summary-refresh.hook.ts`.

3.6 Puntos de invocacion del refresh (documentado, sin implementar)
- App open (cold start).
- Al entrar a tab Summary.
- Pull-to-refresh manual en Home.
- Al crear/editar un record (si aplica).
- Aceptacion: puntos de invocacion definidos en este documento.
 - Estado: ✅


## Fase 4 - UI base y navegacion (2 - 3 dias)

4.1 Layout y rutas
- Crear `(tabs)/summary/_layout.tsx` con Stack.
- Crear placeholders en rutas definidas.
- Aceptacion: navegacion funcional.
 - Estado: ✅

4.2 Pantalla Home
- Secciones: Pinned, Show all, Trends, Highlights.
- Integrar hook home (con placeholders si no hay data).
- Aceptacion: render estable con empty states.
 - Estado: ✅

4.3 Hubs
- `all-data`, `trends`, `highlights` con listas.
- Navegacion a detalle correspondiente.
- Aceptacion: listas navegables.
 - Estado: ✅


## Fase 5 - UI detalle y componentes (2 - 3 dias)

5.1 Plantilla de detalle
- Implementar layout con period selector, charts placeholders, description, analysis.
- Aceptacion: usable para module/field/trend.
 - Estado: ✅

5.2 Componentes reutilizables
- `SummaryCard`, `BarChartMini`, `PinnedSection`, `ListRow`.
- Aceptacion: componentes independientes, accesibles.
 - Estado: ✅ (pendiente: PinnedSection)

5.3 Pinned interactions
- Integrar pin/unpin y reorder en detalle + home.
- Aceptacion: persistencia local y actualizacion UI.
 - Estado: ⏳


## Fase 6 - Estados especiales y i18n (1 - 2 dias)

6.1 i18n keys
- Agregar keys ES/EN para summary.*.
- Aceptacion: no hay claves faltantes.
 - Estado: ✅

6.2 Empty states
- Sin datos, sin historico, sin tendencias.
- Aceptacion: mensajes claros y consistentes.
 - Estado: ✅

6.3 Validaciones
- Evitar NaN, valores negativos, fechas invalidas.
- Aceptacion: UI nunca muestra valores rotos.
 - Estado: ✅ (basico)


## Fase 7 - Tests y QA (2 - 3 dias)

7.1 Unit tests
- Hooks: home, detail, pins.
- Use-cases: agregaciones basicas.
- UI components: SummaryCard, BarChartMini, ...
- Aceptacion: tests pasan.

7.2 Integration tests
- Flow: Home -> Detail -> Pin -> Home.
- Aceptacion: navegacion y estado correcto.

7.3 QA manual
- iOS/Android, estados vacios, performance basica.
- Aceptacion: sin bugs bloqueantes.



## Dependencias y riesgos
- Reuso de `use-report-manager` y datos locales.
- Persistencia MMKV debe estar disponible.
- Charts pueden requerir optimizacion (memoization).


## Entregables
- Rutas Summary funcionales.
- Home + hubs + detail con data real y placeholders donde aplique.
- Pins persistentes.
- Documentacion i18n y tests base.


## Cobertura de la implementacion
- Cubrir todos los requisitos del PRD y PSD.
- Asegurar UX consistente con wireframes y guidelines.
- Mantener Clean Architecture y separation of concerns.
- Proveer base para futuras mejoras (AI analysis, custom modules).
