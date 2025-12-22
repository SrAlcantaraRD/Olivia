# Step 3: Wireframe Refinement - Pestaña "Resumen"

**Fecha:** 18 de diciembre de 2025
**Versión:** 1.0
**Autor:** Don Architect
**Basado en:** PRD, PSD, Step-2 Wireframe

Refinamiento de wireframes basado en feedback. Estilo rápido con ASCII para claridad.

---

## Convenciones de wireframe (igual que step-2)

- `[HEADER]` → cabecera de pantalla
- `[CARD]` → tarjeta / sección agrupada
- `[ROW]` → fila navegable
- `[CHART]` → visualización (placeholder)
- `[ACTION]` → acción del usuario
- `[EMPTY]` → estado vacío
- `[PLACEHOLDER]` → contenido futuro (IA, proyección, etc.)

---

## 1. Home — Resumen (Refinado)

```
+--------------------------------------------------+
|                    RESUMEN                       |
+--------------------------------------------------+

+--------------------------------------------------+
|  Datos fijados                                   |
|--------------------------------------------------|
|  [ CIC · 14:30 ]    [ Orina · Ayer ]             |
|  [ Deposiciones ]                                |
|                                                  |
|                              [ Editar ]          |
+--------------------------------------------------+

+--------------------------------------------------+
|  Mostrar todos los datos de salud              > |
+--------------------------------------------------+

+--------------------------------------------------+
|  Tendencias                                   > |
+--------------------------------------------------+

+--------------------------------------------------+
|  Datos importantes                               |
|--------------------------------------------------|
|  • Esta semana has realizado más CIC de lo usual |
|  • La media diaria de orina ha aumentado         |
|                                                  |
|  Mostrar todos los datos importantes           > |
+--------------------------------------------------+
```

**Refinamientos:**
- Time: hh:mm si <24h, "Ayer" o "+X horas/días" si >24h.
- PinnedSection: Drag-and-drop para ordenar.
- Default: 1 card por módulo si no hay pins.
- Empty: "Añade tu primer registro para ver estadísticas".
- Estilo visual (mockup):
  - Fondo oscuro con gradiente cálido arriba (naranja/marrón suave).
  - Cards con esquinas redondeadas grandes y fondo gris oscuro.
  - Accent naranja para iconos, líneas de media y métricas destacadas.
  - Rows tipo "pill" con icono a la izquierda y chevron a la derecha.
- SummaryCard ASCII:
```
  +--------------------------------------------------+
  |  [logo] [nombre]                    [hh:mm]  (>) | -> hh:mm | ultimo registro [o días desde el último]
  +                           +------------------+   |
  |                           |     BAR CHART    |   | -> las barras de dias pasado accent vs primary
  |                           |    LAST 7 DAYS   |   |
  +  [today count]            +------------------+   |
  +--------------------------------------------------+
```

---

## 2. Mostrar todos los datos de salud (Refinado)

```
+--------------------------------------------------+
|           TODOS LOS DATOS DE SALUD                |
+--------------------------------------------------+

+--------------------------------------------------+
|  Cateterismo intermitente (CIC)               > |
+--------------------------------------------------+
|  Orina                                        > |
+--------------------------------------------------+
|  Deposiciones                                 > |
+--------------------------------------------------+
|  Medicación                                   > |
+--------------------------------------------------+
|  Hidratación                                  > |
+--------------------------------------------------+
|  Eventos de salud                              > |
+--------------------------------------------------+
```

**Refinamientos:**
- Header: Back button + título i18n.
- Foco: Scroll a módulo si viene de detalle.
- Grupos: Separadores visuales entre categorías.
- Estilo visual (mockup): rows tipo pill, icono a la izquierda, texto con jerarquía clara.

---

## 3. Tendencias (Refinado)

```
+--------------------------------------------------+
|                    TENDENCIAS                    |
+--------------------------------------------------+

+--------------------------------------------------+
|  ↑ CIC en aumento últimas semanas             > |
+--------------------------------------------------+
|  → Deposiciones estables último mes           > |
+--------------------------------------------------+

+--------------------------------------------------+
|  [EMPTY] No hay tendencias aún                   |
+--------------------------------------------------+
```

**Refinamientos:**
- TrendCard: Icon (↑↓→) + descripción corta + chevron.
- Placeholder: Texto motivacional si vacío.
- Estilo visual (mockup): card grande con mini chart y línea de media naranja.

---

## 4. Datos importantes (Refinado)

```
+--------------------------------------------------+
|               DATOS IMPORTANTES                  |
+--------------------------------------------------+

+--------------------------------------------------+
|  • Media de CIC superior a lo habitual        > |
+--------------------------------------------------+
|  • Volumen de orina en aumento                > |
+--------------------------------------------------+
|  • Patrón regular en deposiciones             > |
+--------------------------------------------------+
```

**Refinamientos:**
- Preview: Bullet + texto corto.
- Navegación: A módulo/campo relevante.
- Estilo visual (mockup): cards similares a SummaryCard con mini chart inferior.

---

## 5. Detalle — Plantilla única (Refinado)
*(Módulo / Campo / Tendencia)*

```
+--------------------------------------------------+
|        CATETERISMO INTERMITENTE (CIC)             |
+--------------------------------------------------+

+--------------------------------------------------+
|  Día | Semana | Mes | 6 Meses | Año               |
+--------------------------------------------------+

+--------------------------------------------------+
|                                                  |
|        [ Gráfico de barras por periodo ]          |
|                                                  |
+--------------------------------------------------+

+--------------------------------------------------+
|                                                  |
|  [ Barras + línea horizontal de promedio ]       |
|                                                  |
+--------------------------------------------------+

+--------------------------------------------------+
|  Estado de hoy                                   |
|--------------------------------------------------|
|  Valor: 5        Promedio: 4                     |
|  Estás por encima de lo habitual                 |
+--------------------------------------------------+

+--------------------------------------------------+
|  Proyección                                      |
|--------------------------------------------------|
|  [PLACEHOLDER] Datos insuficientes               |
+--------------------------------------------------+

+--------------------------------------------------+
|  Acerca de CIC                                   |
|--------------------------------------------------|
|  Texto descriptivo desde i18n                    |
+--------------------------------------------------+

+--------------------------------------------------+
|  Análisis                                        |
|--------------------------------------------------|
|  [PLACEHOLDER] Próximamente: análisis con IA     |
|  [ACTION] Regenerar                              |
+--------------------------------------------------+

+--------------------------------------------------+
|  Opciones                                        |
|--------------------------------------------------|
|  [✓] Fijar en Resumen                             |
|  Mostrar todos los datos                      > |
+--------------------------------------------------+
```

**Refinamientos:**
- Selector: Dropdown con opciones fijas.
- Charts: Placeholder con nota de optimización.
- Análisis: Loading skeleton + regenerate button.
- Fijar: Toggle con feedback.
- Estilo visual (mockup):
  - Selector de periodo en chips con fondo oscuro.
  - Chart principal con barras naranjas sobre fondo negro.
  - Comparativa mensual con barras horizontales (accent vs muted).
  - Sección "Acerca de" como card con texto largo.

---

## 6. Estados especiales (Refinado)

### Sin datos
```
+--------------------------------------------------+
|  [EMPTY] No hay datos para este periodo          |
|  Añade tu primer registro                        |
+--------------------------------------------------+
```

### Histórico insuficiente
```
[CARD]
  Comparativas no disponibles (mín 5 días)
```

### Loading
```
[CHART]
  [PLACEHOLDER] Cargando...
```

---

## 7. Comportamientos clave (funcionales - igual)

- **Fijar en Resumen**
  - Disponible en cualquier detalle.
  - Afecta al Home → “Datos fijados”.
  - Estado persistente (MMKV).

- **Mostrar todos los datos**
  - Desde módulo → lista de módulos (foco).
  - Desde campo → detalle de módulo.
  - Desde tendencia → módulo o lista base.

---

## 8. Alcance del refinamiento

Incluido:
- Detalles visuales y funcionales.
- Estados edge cases.
- Consistencia con PRD/PSD.

Excluido:
- Estilos finales (HeroUI).
- Implementación técnica.

---

## Próximo paso
- Aprobación y pasar a implementación (Fase 1).
