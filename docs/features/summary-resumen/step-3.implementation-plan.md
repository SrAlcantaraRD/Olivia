## Plan de Implementación Detallado

Fecha: 2025-12-18

Este plan detalla las tareas y subtareas para implementar la pestaña "Resumen" de manera incremental, siguiendo Clean Architecture y las reglas de la app Oliva. Cada tarea incluye criterios de aceptación, dependencias y estimación aproximada (en horas/días).

### Fase 1: Preparación y Estructura (1-2 días)
**Objetivo:** Establecer la base técnica y documental sin código funcional.

1. **Refinar documentación y wireframes**
   - Subtarea 1.1: Actualizar `summary-resumen-plan.md` con decisiones finales (e.g., rutas, adapters).
   - Subtarea 1.2: Completar wireframes detallados para cada pantalla (Home, hubs, detalle).
   - Subtarea 1.3: Definir contratos de datos (e.g., `SummaryModule`) en domain.
   - Criterios: Documento aprobado, wireframes en Figma o similar.
   - Dependencias: Ninguna.

2. **Crear estructura de carpetas y archivos base**
   - Subtarea 2.1: Crear carpetas en `src/app/(tabs)/summary/` con `_layout.tsx`, `index.tsx`, etc.
   - Subtarea 2.2: Crear archivos base en `src/domain/summary/` (entities, ports, use-cases).
   - Subtarea 2.3: Crear archivos base en `src/database/adapter/summary/` y `src/hooks/summary/`.
   - Criterios: Estructura creada, archivos con skeletons (imports básicos).
   - Dependencias: Tarea 1.

3. **Configurar i18n base**
   - Subtarea 3.1: Añadir keys estáticas en `src/ui/i18n/` (ES y EN) para titles, buttons, empty states.
   - Subtarea 3.2: Verificar interpolación para keys dinámicas.
   - Criterios: Keys compilables sin errores.
   - Dependencias: Tarea 1.

### Fase 2: Implementación de UI y Navegación (2-3 días)
**Objetivo:** Pantallas estáticas con navegación funcional.

4. **Implementar layout y Home (index.tsx)**
   - Subtarea 4.1: Crear `_layout.tsx` con header y navegación básica.
   - Subtarea 4.2: Implementar `index.tsx` con secciones estáticas (placeholders para cards y rows).
   - Subtarea 4.3: Añadir navegación a hubs (all-data, trends, highlights).
   - Criterios: Pantalla renderiza sin errores, navegación funciona.
   - Dependencias: Fase 1.

5. **Implementar hubs (all-data, trends, highlights)**
   - Subtarea 5.1: Crear `all-data.tsx` con lista estática de módulos.
   - Subtarea 5.2: Crear `trends/index.tsx` con lista placeholder de trends.
   - Subtarea 5.3: Crear `highlights/index.tsx` con lista placeholder de insights.
   - Subtarea 5.4: Añadir navegación desde hubs a detalles.
   - Criterios: Hubs renderizan, navegación a detalles (aunque vacíos).
   - Dependencias: Tarea 4.

6. **Implementar plantilla de detalle**
   - Subtarea 6.1: Crear `detail/module.tsx` con estructura base (selector periodo, charts placeholders, descripción i18n).
   - Subtarea 6.2: Crear `detail/module-field.tsx` y `detail/trend.tsx` reutilizando plantilla.
   - Subtarea 6.3: Añadir opciones ("Fijar", "Mostrar todos").
   - Criterios: Detalles renderizan con placeholders, opciones visibles.
   - Dependencias: Tarea 5.

### Fase 3: Integración de Datos y Lógica (3-4 días)
**Objetivo:** Conectar datos reales, hooks y persistencia.

7. **Implementar domain y adapters para datos**
   - Subtarea 7.1: Definir entities y ports en `src/domain/summary/`.
   - Subtarea 7.2: Crear adapters en `src/database/adapter/summary/` para queries (reusar report-manager).
   - Subtarea 7.3: Implementar use-cases para aggregation (todayCount, last7Days, etc.).
   - Criterios: Ports definidos, adapters básicos funcionales.
   - Dependencias: Fase 2.

8. **Crear hooks para UI**
   - Subtarea 8.1: Implementar `use-summary-data.hook.ts` para popular cards.
   - Subtarea 8.2: Implementar `use-pins.hook.ts` con MMKV para persistencia.
   - Subtarea 8.3: Integrar hooks en pantallas (reemplazar placeholders).
   - Criterios: Datos dinámicos en UI, pins persisten.
   - Dependencias: Tarea 7.

9. **Implementar componentes reutilizables**
   - Subtarea 9.1: Crear `SummaryCard` con BarChartMini.
   - Subtarea 9.2: Crear `PinnedSection` con drag-and-drop.
   - Subtarea 9.3: Crear `ListRow` con iconos.
   - Criterios: Componentes renderizan correctamente, accesibles.
   - Dependencias: Tarea 8.

### Fase 4: Funcionalidades Avanzadas y AI (2-3 días)
**Objetivo:** Completar features transversales y placeholders.

10. **Implementar "Fijar en Resumen"**
    - Subtarea 10.1: Añadir lógica en detalles para pin/unpin.
    - Subtarea 10.2: Actualizar Home para mostrar pins ordenados.
    - Subtarea 10.3: Soporte para reordenar en PinnedSection.
    - Criterios: Pins persisten y afectan Home.
    - Dependencias: Tarea 9.

11. **Añadir análisis AI placeholder**
    - Subtarea 11.1: Crear `src/services/analysis/aiAnalysis.stub.ts` con interfaz.
    - Subtarea 11.2: Integrar en detalles con loading y regenerate.
    - Subtarea 11.3: Definir `AnalysisInput` (moduleId, rango, stats).
    - Criterios: Placeholder muestra texto básico.
    - Dependencias: Tarea 10.

12. **Implementar estados vacíos y validaciones**
    - Subtarea 12.1: Añadir empty states en todas las pantallas.
    - Subtarea 12.2: Validar histórico insuficiente (>=5 días).
    - Subtarea 12.3: Mensajes i18n para "No data yet", etc.
    - Criterios: No NaN, UX clara en estados vacíos.
    - Dependencias: Tarea 11.

### Fase 5: Tests y Refinamiento (2-3 días)
**Objetivo:** Validar y pulir.

13. **Añadir tests unitarios e integration**
    - Subtarea 13.1: Tests para hooks (summary data, pins).
    - Subtarea 13.2: Snapshots para componentes (SummaryCard).
    - Subtarea 13.3: Integration para navegación (Home -> Detail -> Pin).
    - Criterios: Cobertura >80%, tests pasan.
    - Dependencias: Fase 4.

14. **Refinamiento y QA manual**
    - Subtarea 14.1: Revisar accesibilidad y i18n.
    - Subtarea 14.2: Pruebas en device/simulador.
    - Subtarea 14.3: Ajustes basados en feedback.
    - Criterios: Funcionalidad completa, sin bugs críticos.
    - Dependencias: Tarea 13.

15. **PR y merge**
    - Subtarea 15.1: Crear PR con descripción detallada.
    - Subtarea 15.2: Code review y merge.
    - Criterios: Aprobado y merged.
    - Dependencias: Tarea 14.

### Notas Generales
- **Estimaciones:** Aproximadas; ajustar según progreso.
- **Dependencias Técnicas:** Reusar `use-report-manager`, MMKV adapter, i18n setup.
- **Riesgos:** Cambios en domain podrían afectar; validar temprano.
- **Métricas de Éxito:** MVP funcional, navegación fluida, datos agregados correctos.
- **Próximo:** Empezar con Fase 1 tras aprobación.
