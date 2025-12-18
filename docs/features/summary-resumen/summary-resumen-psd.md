# Product Specification Document (PSD): Pestaña "Resumen" en Oliva App

**Fecha:** 18 de diciembre de 2025
**Versión:** 1.0
**Autor:** Don Architect (Senior Architect, Oliva Team)
**Basado en:** PRD v1.0, Wireframes, Implementation Plan

## 1. Visión General

### 1.1 Propósito
Este PSD detalla las especificaciones técnicas para implementar la pestaña "Resumen", incluyendo arquitectura, componentes, datos y tests. Sigue Clean Architecture (Domain → Infra → UI) y Atomic Design.

### 1.2 Arquitectura General
- **Stack:** Expo, React Native, SQLite (Drizzle), HeroUI.
- **Patrón:** Clean Architecture + Hexagonal.
- **Flujo:** UI (View) → Hooks (Logic) → Domain (Boss) ← Infrastructure (Data).

## 2. Especificaciones Técnicas

### 2.1 Rutas y Navegación (Expo Router)
- `(tabs)/summary/_layout.tsx`: Stack layout con header.
- `(tabs)/summary/index.tsx`: Home con secciones verticales.
- `(tabs)/summary/all-data.tsx`: Lista módulos.
- `(tabs)/summary/trends/index.tsx`: Lista trends.
- `(tabs)/summary/highlights/index.tsx`: Lista highlights.
- `detail/module/[moduleId].tsx`: Detalle módulo.
- `detail/module/[moduleId]/field/[fieldId].tsx`: Detalle campo.
- `detail/trend/[trendId].tsx`: Detalle trend.

### 2.2 Componentes UI (Atomic Design)
- **SummaryCard**: Header (icon+name+time) + metric grande + BarChartMini + chevron.
- **BarChartMini**: Barras 7 días con línea media (accent/primary).
- **PinnedSection**: Fila ordenable con drag-and-drop.
- **ListRow**: Fila navegación con icon + text.

### 2.3 Integración de Datos
- **Contrato SummaryModule**:
  ```typescript
  interface SummaryModule {
    id: string;
    nameKey: string; // i18n key
    icon: IconName;
    todayCount: number;
    lastRecordedAt: string; // ISO
    last7Days: { date: string, value: number }[];
    previousPeriodAverage: number;
  }
  ```
- Reusar `use-report-manager.hook.ts` para aggregations.
- Cálculos: todayCount = suma registros hoy; last7Days incluye hoy; previousPeriodAverage dinámico.

### 2.4 Persistencia
- Adapter: MMKV para pins.
- Estructura: `{type: 'module'|'field'|'trend', id: string, order: number, pinnedAt: string}`.
- Orden: Custom order, sin límite (warning si >10).

### 2.5 i18n
- Keys: `summary.module.[id].title`, `summary.buttons.showAll`, etc.
- Interpolación: `t('key', {var})` para dinámicas.

### 2.6 Análisis AI (Placeholder)
- Stub: `src/services/analysis/aiAnalysis.stub.ts`
- Interfaz: `generateAnalysis(input: AnalysisInput): Promise<string>`
- `AnalysisInput`: `{moduleId: string, period: Period, stats: object}`

### 2.7 Estados Vacíos
- Mensajes: "No data yet", "Add your first record", etc.
- Validación: Histórico >=5 días para stats.

## 3. Wireframes y Diseño
- Referencia: `summary-resumen.wireframe.md`
- Home: Secciones verticales (pins, accesos).
- Detalle: Bloques fijos (selector, charts, descripción, análisis).

## 4. APIs y Puertos
- **Port:** `SummaryDataPort` para queries.
- **Adapter:** `SummaryDataAdapter` implementa port, usa Drizzle.
- **Use Cases:** `GetSummaryModulesUseCase`, etc.

## 5. Tests
- **Unit:** Hooks, components (snapshots).
- **Integration:** Navegación, datos reales.
- **E2E:** Detox para flows completos.
- Cobertura: >80%.

## 6. Riesgos Técnicos
- Aggregations complejas → Reusar existentes.
- Charts performance → Optimizar con memo.
- Persistencia → Testear en device.

## 7. Cronograma Detallado
- Ver `summary-resumen-implementation-plan.md` para fases y subtareas.

## 8. Aprobaciones
- Tech Lead: [Firma]
- QA Lead: [Firma]
