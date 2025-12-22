## Resumen (Tab) — Plan de implementación

Fecha: 2025-12-14

## Resumen (Tab) — Wireframes (alto nivel)

Fecha: 2025-12-14
Estado: Diseño (wireframes conceptuales)

---

## Convenciones de wireframe

- `[HEADER]` → cabecera de pantalla
- `[CARD]` → tarjeta / sección agrupada
- `[ROW]` → fila navegable
- `[CHART]` → visualización (placeholder)
- `[ACTION]` → acción del usuario
- `[EMPTY]` → estado vacío
- `[PLACEHOLDER]` → contenido futuro (IA, proyección, etc.)

---

## 1. Home — Resumen

```
+--------------------------------------------------+
|                    RESUMEN                       |
+--------------------------------------------------+

+--------------------------------------------------+
|  Datos fijados                                   |
|--------------------------------------------------|
|  [ CIC · Hoy ]      [ Orina · 7 días ]            |
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

**Notas**
- Máx. 1–2 cards por sección (curación).
- Todo item navega a una pantalla de detalle o hub.

---

## 2. Mostrar todos los datos de salud

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

**Notas**
- Cada fila abre el **detalle de módulo**.
- Puede recibir foco desde otras pantallas.

---

## 3. Tendencias (lista)

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
|  No hay más tendencias disponibles               |
+--------------------------------------------------+
```

**Notas**
- Cada TrendCard abre **detalle de tendencia**.
- Estado vacío explícito.

---

## 4. Datos importantes (lista completa)

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

**Notas**
- Cada card navega a detalle de módulo o campo.

---

## 5. Detalle — Plantilla única
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
|  []  (Datos insuficientes)                       |
+--------------------------------------------------+

+--------------------------------------------------+
|  Acerca de CIC                                   |
|--------------------------------------------------|
|  Texto descriptivo desde i18n                    |
+--------------------------------------------------+

+--------------------------------------------------+
|  Análisis                                        |
|--------------------------------------------------|
|  Próximamente: análisis inteligente con IA       |
+--------------------------------------------------+

+--------------------------------------------------+
|  Opciones                                        |
|--------------------------------------------------|
|  [✓] Fijar en Resumen                             |
|  Mostrar todos los datos                      > |
+--------------------------------------------------+
```

**Notas**
- Misma estructura para módulo, campo y tendencia.
- Los charts no se renderizan si no hay datos.

---

## 6. Estados especiales

### Sin datos
```
+--------------------------------------------------+
|  No hay datos para este periodo                  |
+--------------------------------------------------+
```

### Sin histórico suficiente
```
[CARD]
  Comparativas no disponibles
```

---

## 7. Comportamientos clave (funcionales)

- **Fijar en Resumen**
  - Disponible en cualquier detalle.
  - Afecta al Home → “Datos fijados”.
  - Estado persistente.

- **Mostrar todos los datos**
  - Desde módulo → lista de módulos (foco).
  - Desde campo → detalle de módulo.
  - Desde tendencia → módulo o lista base.

---

## 8. Alcance del wireframe

Incluido:
- Estructura visual
- Navegación
- Jerarquía de contenido

Excluido:
- Estilos finales
- Algoritmos de cálculo
- Contenido IA real

---

## Próximo paso
- Definición visual de cards y charts
- Degradación a especificación técnica

---
