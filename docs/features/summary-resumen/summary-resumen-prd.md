# Product Requirements Document (PRD): Pestaña "Resumen" en Oliva App

**Fecha:** 18 de diciembre de 2025
**Versión:** 1.0
**Autor:** Don Architect (Senior Architect, Oliva Team)
**Revisado por:** Product Owner, UX Designer

## 1. Introducción

### 1.1 Propósito del Documento
Este PRD define los requerimientos para la implementación de la nueva pestaña "Resumen" en la app Oliva. La pestaña proporcionará una vista agregada y curada de los datos de salud del usuario, inspirada en la UX de Apple Health, permitiendo un acceso rápido a información clave sin sobrecargar la interfaz.

### 1.2 Alcance
- Nueva pestaña "Resumen" como sibling de "Reportes".
- Funcionalidades: Cards por módulo, hubs (all-data, trends, highlights), detalles reutilizables, pins persistentes.
- No incluye: Algoritmos avanzados de IA, sincronización cross-device (fuera de MVP).

### 1.3 Contexto de Negocio
Oliva es una app para el seguimiento de cateterismo y salud relacionada. Los usuarios necesitan una forma rápida de revisar su progreso diario/semanal sin navegar profundamente. "Resumen" aborda esto ofreciendo datos agregados, tendencias y insights.

## 2. Objetivos

### 2.1 Objetivo Principal
Crear una pestaña que muestre información agregada por módulo y campo, mejorando la UX para usuarios que quieren un overview rápido de su salud.

### 2.2 Objetivos Específicos
- Reducir tiempo de navegación para acceder a datos clave.
- Inspirar confianza con datos curados (no exhaustivos).
- Permitir personalización vía pins.
- Mantener consistencia con el diseño de Apple Health.

### 2.3 Métricas de Éxito
- 80% de usuarios activos usan "Resumen" semanalmente.
- Reducción del 30% en tiempo promedio para revisar datos diarios.
- Satisfacción del usuario >4.5/5 en encuestas.

## 3. Requerimientos Funcionales

### 3.1 Home "Resumen"
- **RF1.1:** Mostrar sección "Datos fijados" con cards ordenables.
- **RF1.2:** Acceso rápido a "Mostrar todos los datos", "Tendencias", "Datos importantes".
- **RF1.3:** Cards por módulo con: logo, nombre, timestamp último registro, contador hoy, mini gráfico últimos 7 días.

### 3.2 Hubs
- **RF2.1:** "Mostrar todos los datos": Lista agrupada por módulo, navegación a detalles.
- **RF2.2:** "Tendencias": Lista de tendencias detectadas, navegación a detalles.
- **RF2.3:** "Datos importantes": Lista de insights, navegación a detalles.

### 3.3 Detalles
- **RF3.1:** Plantilla única para módulo/campo/trend: selector periodo, chart principal, chart con media, estado hoy, proyección, descripción i18n, análisis AI.
- **RF3.2:** Opciones: "Fijar en Resumen", "Mostrar todos los datos".

### 3.4 Funcionalidades Transversales
- **RF4.1:** "Fijar en Resumen": Persistente local, afecta Home.
- **RF4.2:** Navegación predecible entre hubs y detalles.

### 3.5 Estados Especiales
- **RF5.1:** Empty states con mensajes claros (e.g., "No data yet").
- **RF5.2:** Validación de histórico insuficiente (>=5 días para estadísticas).

## 4. Requerimientos No Funcionales

### 4.1 Rendimiento
- **RNF1.1:** Carga inicial <2s en device promedio.
- **RNF1.2:** Navegación fluida, sin lag en charts.

### 4.2 Usabilidad
- **RNF2.1:** Accesible (WCAG 2.1 AA), soporte i18n (ES/EN).
- **RNF2.2:** Diseño responsive, optimizado para móvil.

### 4.3 Seguridad
- **RNF3.1:** Datos locales, no expuestos a red.
- **RNF3.2:** Persistencia segura con MMKV.

### 4.4 Compatibilidad
- **RNF4.1:** iOS/Android, Expo SDK actual.
- **RNF4.2:** Reutiliza componentes existentes (Atomic Design).

## 5. Stakeholders

- **Usuario Final:** Pacientes post-cateterismo, necesitan overview simple.
- **Product Owner:** Define prioridades, valida requerimientos.
- **UX Designer:** Wireframes y diseño visual.
- **Developers:** Implementan siguiendo Clean Architecture.
- **QA:** Tests unitarios, integration, e2e.

## 6. Riesgos y Mitigaciones

- **Riesgo 1:** Complejidad de datos agregados → Mitigación: Reusar `use-report-manager`.
- **Riesgo 2:** Persistencia local vs cross-device → Mitigación: MVP local, extensible.
- **Riesgo 3:** Cambios en domain afectan → Mitigación: Validar contratos temprano.

## 7. Cronograma Estimado
- Fase 1-2: 1-2 semanas (estructura y UI).
- Fase 3-4: 2-3 semanas (datos y features).
- Fase 5: 1 semana (tests y QA).
- Total: 4-6 semanas para MVP.

## 8. Aprobaciones
- Product Owner: [Firma]
- UX Designer: [Firma]
- Tech Lead: [Firma]
