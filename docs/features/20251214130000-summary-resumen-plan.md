## Resumen (Tab) — Plan de implementación

Fecha: 2025-12-14

Objetivo
- Crear una nueva pestaña `Resumen` (sibling de `Reportes`) que muestre información agregada por módulo y por campo, inspirada en la UX de Apple Health, sin romper la tab existente de `Reportes`.

Requerimientos de alto nivel
- Home `Resumen` con sección `Datos fijados` (pins), acceso rápido a `Mostrar todos los datos de salud`, `Tendencias` y `Datos importantes`.
- Cards por módulo: logo, nombre, timestamp/ultimo registro, contador hoy, y mini gráfico de barras últimos 7 días (accent vs primary).
- Listas/hubs: `all-data`, `trends`, `highlights`.
- Detalle reutilizable para: módulo / field / trend. Cada detalle tendrá: 1) Descripción (desde i18n) y 2) Análisis (placeholder AI).
- Soporte para “Fijar en Resumen” (persistente) y navegación entre hubs y detalles.

Rutas propuestas (Expo Router)
- `src/app/(tabs)/summary/_layout.tsx` -> Stack layout para Summary
- `src/app/(tabs)/summary/index.tsx` -> Home Resumen (cards + accesos)
- `src/app/(tabs)/summary/all-data.tsx` -> Mostrar todos los datos
- `src/app/(tabs)/summary/trends.tsx` -> Tendencias (lista de trends)
- `src/app/(tabs)/summary/highlights.tsx` -> Datos importantes / insights
- `src/app/(tabs)/summary/detail/module.tsx` -> Detalle módulo
- `src/app/(tabs)/summary/detail/module-field.tsx` -> Detalle field
- `src/app/(tabs)/summary/detail/trend.tsx` -> Detalle trend

Componentes UI (reutilizables)
- `SummaryCard` — header (icon+name+time) + metric grande + small bar chart + chevron
```
  +--------------------------------------------------+
  |  [logo] [nombre]                    [hh:mm]  (>) | -> hh:mm | ultimo registro [o días desde el último]
  +                           +------------------+   |
  |                           |     BAR CHART    |   | -> las barras de dias pasado accent vs primary
  |                           |    LAST 7 DAYS   |   |
  +  [today count]            +------------------+   |
  +--------------------------------------------------+
```
- `BarChartMini` — barra de 7 días con línea de referencia (media)
- `PinnedSection` — fila de items fijados, ordenable
- `ListRow` — fila simple para accesos (Mostrar todos / Tendencias / Datos importantes)

Integración de datos
- Reusar `use-report-manager.hook.ts` y puertos de domain para obtener: últimos 7 días, media del periodo anterior, totales diarios.
- Definir contrato mínimo `SummaryModule`:
  - id: string
  - nameKey: string (i18n key)
  - icon: IconName
  - todayCount: number
  - lastRecordedAt: ISOString
  - last7Days: Array<{ date: ISOString, value: number }>
  - previousPeriodAverage: number

Persistencia pins
- Usar adapter de cache (existing `expo-secure-store.cache-port.adapter.ts` o mmkv) para persistir lista de pins: {type:'module'|'field'|'trend', id, pinnedAt}

i18n
- Añadir keys en `src/ui/i18n` (ES y EN):
  - `summary.module.[moduleId].title`
  - `summary.module.[moduleId].description`  // texto largo mostrado en detalle
  - `summary.buttons.showAll`, `summary.buttons.trends`, `summary.buttons.highlights`

Análisis (AI) — placeholder
- Añadir stub `src/services/analysis/aiAnalysis.stub.ts` que retorne texto placeholder. Interfaz:
  - `generateAnalysis(moduleOrFieldData): Promise<string>`
- UI muestra `Análisis` con estado `loading` y `Editar/Regenerar`.

Tests
- Unit: hooks (summary data aggregation), components (SummaryCard snapshot + behavior)
- Integration: navigation flows (Home -> Detail -> Pin -> Home shows pinned)

Fases y entregables mínimos (MVP)
1. Documento y rutas (esta tarea)
2. Implementar `summary/index` con `SummaryCard` estático + navegación a detail
3. Reutilizar hook para popular cards (last7 + today) y añadir pin persistente
4. Implementar `all-data`, `trends`, `highlights` con datos estáticos/placeholder
5. Detalle con i18n Description + AI placeholder
6. Tests y PR

Decisiones pendientes / preguntas
- Ruta: `summary` (EN) vs `resumen` (ES) — recomiendo `summary` y label `Resumen` vía i18n.
- ¿Querés que los pins sean cross-device (requiere servidor) o solo local? Recomiendo local para MVP.

Próximos pasos inmediatos
- Crear la estructura de carpetas en `src/app/(tabs)/summary` y un primer `index.tsx` con `SummaryCard` estático.
- Implementar hook de pins y prueba manual en app.

---

## Resumen (Tab) — Plan de diseño y navegación (alto nivel)

Fecha: 2025-12-14

### Objetivo
Definir, a nivel de **diseño funcional y navegación**, la nueva pestaña **Resumen**, inspirada en la UX de Apple Health.
El foco está en:
- Qué pantallas existen
- Qué muestra cada una
- Cómo se navega entre ellas
- Qué funcionalidades transversales existen (p. ej. *Fijar en Resumen*)

La implementación técnica se detallará en fases posteriores.

---

## Principios de diseño
- **Curación, no exhaustividad**: Resumen muestra pocos datos bien seleccionados.
- **Plantilla única de detalle**: módulos, campos y tendencias comparten estructura.
- **Navegación predecible**: hubs claros → detalle profundo.
- **Estado persistente del usuario**: fijar elementos afecta al Resumen global.
- **Nunca datos rotos**: empty states explícitos, nada de NaN.

---

## Navegación y rutas (Expo Router)

### Tab nueva: Resumen
- `(tabs)/summary/_layout`
	→ Layout del stack de “Resumen”
- `(tabs)/summary/index`
	→ Home “Resumen”

### Rutas Summary (listas / hubs)
- `(tabs)/summary/all-data`
	→ “Mostrar todos los datos de salud”
- `(tabs)/summary/trends/index`
	→ “Tendencias”
- `(tabs)/summary/highlights/index`
	→ “Datos importantes”

### Rutas Summary (detalle – plantilla única)
- `(tabs)/summary/detail/module/[moduleId]`
	→ Detalle de módulo (CIC, Stool, Medicación, etc.)
- `(tabs)/summary/detail/module/[moduleId]/field/[fieldId]`
	→ Detalle de campo dentro de un módulo
- `(tabs)/summary/detail/trend/[trendId]`
	→ Detalle de tendencia

### Accesos comunes
- Home → all-data
- Home → trends
- Home → highlights
- Desde cualquier card → Detail correspondiente

---

## Pantallas y contenido

### 1. Home “Resumen”
Pantalla curada con bloques verticales:

**Secciones**
1. **Datos fijados**
	- Cards pequeñas fijadas por el usuario
	- Acción “Editar” (reordenar / eliminar)
2. **Mostrar todos los datos de salud**
	- Fila de navegación
3. **Tendencias**
	- Fila de navegación
4. **Datos importantes**
	- 1–3 highlight cards
	- Acceso a lista completa

---

### 2. Mostrar todos los datos de salud
Lista agrupada por módulo:
- CIC
- Orina
- Deposiciones
- Medicación
- Hidratación
- Eventos de salud

Cada item navega a **detalle de módulo**.

---

### 3. Tendencias
- Lista de tendencias detectadas
- Estado vacío si no hay tendencias
- Cada tendencia navega a **detalle de tendencia**

---

### 4. Datos importantes
- Lista completa de insights
- Cada item navega a:
	- Detalle de módulo o
	- Detalle de campo

---

## Plantilla única de detalle
Aplicable a:
- Módulo
- Campo
- Tendencia

### Bloques (orden fijo)
1. **Selector de periodo**
	- Día / Semana / Mes / 6 Meses / Año
2. **Chart principal**
	- Barras por bucket según periodo
3. **Chart con media**
	- Barras + línea horizontal de promedio
4. **Estado del día actual**
	- Valor de hoy + comparación con promedio
5. **Proyección**
	- Placeholder si no hay señal suficiente
6. **Acerca de**
	- Texto descriptivo desde i18n
7. **Análisis**
	- Placeholder para IA
8. **Opciones**
	- Fijar en Resumen
	- Mostrar todos los datos

---

## Funcionalidades transversales

### Fijar en Resumen
- Disponible en cualquier detalle (módulo, campo o tendencia)
- Persistente (estado del usuario)
- Impacta directamente en Home → sección “Datos fijados”
- Soporta:
	- fijar / desfijar
	- ordenación

### Mostrar todos los datos
- Desde detalle:
	- módulo → all-data (con foco en el módulo)
	- campo → detalle de módulo (con foco opcional)
	- tendencia → all-data o módulo base

---

## Contenido textual (dos niveles)
En detalle:
1. **Descripción**
	- Texto fijo desde i18n
2. **Análisis**
	- Placeholder IA (misma UI para futuro contenido generado)

---

## Estados vacíos y calidad de datos
- Sin datos → Empty State explícito
- Sin histórico suficiente → no se muestran comparativas
- Nunca mostrar valores inválidos

---

## Fuera de alcance (por ahora)
- Algoritmos avanzados de tendencias
- IA real de análisis
- Sincronización cross-device

---

## Próximo paso
- Wireframes de cada pantalla (Home, hubs, detalle)
- Definición visual de cards y charts
- Posterior degradación a especificación técnica

---



Tab nueva: Resumen
   •   (tabs)/summary/_layout
      → Layout del stack de “Resumen” (header, theme, gestures, etc.)
   •   (tabs)/summary/index
      → Home “Resumen”
         - Datos fijados
            - por defecto, uno card por cada modulo activo, cuyo wireframe seria:
            ```
               +--------------------------------------------------+
               |  [logo] [nombre]                    [hh:mm]  (>) | -> hh:mm | ultimo registro [o días desde el último]
               +                           +------------------+   |
               |                           |     BAR CHART    |   | -> las barras de dias pasado accent vs primary
               |                           |    LAST 7 DAYS   |   |
               +  [today count]            +------------------+   |
               +--------------------------------------------------+
            ```
         - Acceso a “Mostrar todos los datos”
         - Acceso a “Tendencias”
         - Datos importantes (highlights)

Rutas Summary (listas / hubs)
   •   (tabs)/summary/all-data
      → “Mostrar todos los datos de salud”
         - Lista de módulos activos
         - Analisis detallado de los datos, medias, comparaciones y patrónes
   •   (tabs)/summary/trends/index
      → “Tendencias”
         - Lista de tendencias [Si se detectan]
				 - Lista card de modulos de medias últimas 26 semanas agrupadas por semana
   •   (tabs)/summary/highlights/index
      → “Datos importantes”
         - Lista completa de insights / highlights

Rutas Summary (detalle – plantilla única)
   •   (tabs)/summary/detail/module/[moduleId]
      → Detalle de módulo
         - Ej: CIC, Stool, Medicación
   •   (tabs)/summary/detail/module/[moduleId]/field/[fieldId]
      → Detalle de campo dentro de un módulo
         - Ej: CIC.volumeMl, Stool.bristolType
   •   (tabs)/summary/detail/trend/[trendId]
      → Detalle de tendencia
         - Misma plantilla que módulo/campo

Accesos comunes dentro de Summary (navegación interna)
   •   Desde Home → (tabs)/summary/all-data
      (row “Mostrar todos los datos de salud”)
   •   Desde Home → (tabs)/summary/trends/index
      (row “Tendencias”)
   •   Desde Home → (tabs)/summary/highlights/index
      (row “Mostrar todos los datos importantes”)

Acciones funcionales desde pantallas de detalle
   •   Opción: “Fijar en Resumen”
      → Persiste pin (module / field / trend)
      → Afecta a (tabs)/summary/index
         (sección “Datos fijados”)

   •   Opción: “Mostrar todos los datos”
      → Si estás en module detail
         → (tabs)/summary/all-data
            (con foco/scroll al módulo)
      → Si estás en field detail
         → (tabs)/summary/detail/module/[moduleId]
            (opcional foco al field)
      → Si estás en trend detail
         → (tabs)/summary/all-data
            o al módulo/campo base del trend
