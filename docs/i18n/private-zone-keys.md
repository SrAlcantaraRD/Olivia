# Private Zone - i18n Keys Documentation

This document lists all internationalization keys required for the private zone implementation, following the established pattern of `page.<screen>.*` for screens and `component.<component>.*` for reusable components.

## Naming Convention

- **Pages/Screens:** `page.<tab-name>.<key>`
- **Components:** `component.<component-name>.<key>`
- **Common/Shared:** `common.<key>`

## Common Keys

```typescript
// Common actions and labels
common.back = 'Back'
common.next = 'Next'
common.cancel = 'Cancel'
common.save = 'Save'
common.edit = 'Edit'
common.delete = 'Delete'
common.confirm = 'Confirm'
common.loading = 'Loading...'
common.error = 'Error'
common.success = 'Success'
common.optional = 'Optional'
common.required = 'Required'
```

## Tab Labels

```typescript
// Main tab navigation labels
tab.register = 'Registro'
tab.report = 'Reporte'
tab.settings = 'Configuración'
```

## Register Tab (Default Landing Page)

```typescript
// page.register.*
page.register.title = 'Registro'
page.register.next-action.title = 'Próxima acción'
page.register.next-action.catheterization = 'Cateterismo en {time}'
page.register.next-action.no-action = 'No hay acciones pendientes'

page.register.status.title = 'Estado del día'
page.register.status.green = 'Todo dentro de lo esperado'
page.register.status.yellow = 'Requiere atención'
page.register.status.red = 'Atención urgente'

page.register.action-button = 'REGISTRAR AHORA'
page.register.action-prompt = '¿Qué quieres registrar ahora?'

page.register.last-record.title = 'Último registro'
page.register.last-record.cic = 'CIC hace {time}'
page.register.last-record.bowel = 'Deposición hace {time}'
page.register.last-record.none = 'No hay registros recientes'
page.register.last-record.tap-to-view = 'Pulsar para ver detalle'
```

## Report Tab

```typescript
// page.report.* (Main report screen)
page.report.title = 'Reporte'

// Child info card
page.report.child-card.age = '{age} años'
page.report.child-card.general-status = 'Estado general'
page.report.child-card.last-cic = 'Último CIC: {time}'
page.report.child-card.last-bowel = 'Última deposición: {time}'

// Next action section
page.report.next-action.title = 'Próxima acción'
page.report.next-action.catheterization-in = 'Próximo cateterismo en {time}'
page.report.next-action.no-pending = 'No hay acciones pendientes'

// Day summary
page.report.day-summary.title = 'Resumen del día'
page.report.day-summary.cic = 'CIC: {count}'
page.report.day-summary.bowel = 'Dep: {count}'
page.report.day-summary.enemas = 'Enemas: {count}'

// Navigation buttons
page.report.view-history = 'Ver historial'
page.report.view-calendar = 'Ver calendario'

// History screen (page.report.history.*)
page.report.history.title = 'Historial'
page.report.history.filter.today = 'Hoy'
page.report.history.filter.7days = '7 días'
page.report.history.filter.30days = '30 días'
page.report.history.filter.custom = 'Personalizado'
page.report.history.view-calendar = 'Ver en calendario'
page.report.history.no-records = 'No hay registros en este período'

// Calendar screen (page.report.calendar.*)
page.report.calendar.title = 'Calendario'
page.report.calendar.selected-day-summary = 'Resumen del día seleccionado'
page.report.calendar.view-day-detail = 'Ver detalle del día'
page.report.calendar.no-records = 'Sin registros'
page.report.calendar.has-records = '{count} registros'
```

## Settings Tab

```typescript
// page.settings.* (Main settings screen)
page.settings.title = 'Configuración'

// Child profile section
page.settings.child-profile.title = 'Perfil del niño'
page.settings.child-profile.personal-data = 'Datos personales'
page.settings.child-profile.diagnosis = 'Diagnóstico'
page.settings.child-profile.view-details = 'Ver detalles'

// Active modules section
page.settings.modules.title = 'Módulos activos'
page.settings.modules.catheterization = 'CIC'
page.settings.modules.bowel-movements = 'Deposiciones'
page.settings.modules.enemas = 'Enemas'
page.settings.modules.medications = 'Meds'

// Carers section
page.settings.carers.title = 'Cuidadores'
page.settings.carers.current-list = 'Lista actual'
page.settings.carers.add-carer = 'Añadir cuidador'
page.settings.carers.show-qr = 'Mostrar mi QR'
page.settings.carers.manage = 'Gestionar cuidadores'

// App settings section
page.settings.app.title = 'Ajustes de la app'
page.settings.app.theme = 'Tema (claro / oscuro / oliva)'
page.settings.app.pin = 'PIN de acceso'
page.settings.app.export = 'Exportar datos'

// Child profile detail screen (page.settings.child-profile-detail.*)
page.settings.child-profile-detail.title = '{name} ({age} años)'
page.settings.child-profile-detail.clinical-data = 'Datos clínicos'
page.settings.child-profile-detail.diagnosis-label = 'Diagnóstico'
page.settings.child-profile-detail.birth-date-label = 'Fecha nacimiento'
page.settings.child-profile-detail.active-modules = 'Módulos activos'
page.settings.child-profile-detail.reminders = 'Recordatorios'
page.settings.child-profile-detail.edit-data = 'Editar datos'
page.settings.child-profile-detail.configure-modules = 'Configurar módulos'

// Carers management screen (page.settings.carers-detail.*)
page.settings.carers-detail.title = 'Cuidadores vinculados'
page.settings.carers-detail.role.admin = 'Admin'
page.settings.carers-detail.role.full = 'Permisos completos'
page.settings.carers-detail.role.register-only = 'Solo registro'
page.settings.carers-detail.role.read-only = 'Solo lectura'

// App settings detail screen (page.settings.app-detail.*)
page.settings.app-detail.title = 'Ajustes'
page.settings.app-detail.appearance.title = 'Apariencia'
page.settings.app-detail.appearance.theme = 'Tema'
page.settings.app-detail.appearance.theme-light = 'Claro'
page.settings.app-detail.appearance.theme-dark = 'Oscuro'
page.settings.app-detail.appearance.theme-oliva = 'Oliva'
page.settings.app-detail.appearance.text-size = 'Tamaño del texto'

page.settings.app-detail.security.title = 'Seguridad'
page.settings.app-detail.security.enable-pin = 'Activar PIN'
page.settings.app-detail.security.auto-lock = 'Bloqueo automático'
page.settings.app-detail.security.secure-delete = 'Borrado seguro'

page.settings.app-detail.data.title = 'Datos'
page.settings.app-detail.data.export-pdf = 'Exportar datos (PDF/CSV)'
page.settings.app-detail.data.local-backup = 'Copias de seguridad (solo local)'
```

## CIC Registration Wizard

```typescript
// page.cic-register.* (5-step wizard)

// Volume step
page.cic-register.volume.title = 'Volumen de orina'
page.cic-register.volume.description = 'Selecciona el volumen observado'
page.cic-register.volume.low = 'Bajo'
page.cic-register.volume.normal = 'Normal'
page.cic-register.volume.high = 'Alto'

// Color step
page.cic-register.color.title = 'Color de la orina'
page.cic-register.color.description = 'Selecciona el color observado'
page.cic-register.color.transparent = 'Transparente'
page.cic-register.color.light-yellow = 'Amarillo claro'
page.cic-register.color.dark-yellow = 'Amarillo oscuro'
page.cic-register.color.abnormal = 'Anómalo'

// Turbidity step
page.cic-register.turbidity.title = 'Turbidez'
page.cic-register.turbidity.description = 'Selecciona la turbidez observada'
page.cic-register.turbidity.clear = 'Clara'
page.cic-register.turbidity.slight = 'Leve'
page.cic-register.turbidity.high = 'Alta'

// Discomfort step
page.cic-register.discomfort.title = '¿Hubo molestias?'
page.cic-register.discomfort.description = 'Indica si el niño/a presentó molestias'
page.cic-register.discomfort.none = 'No'
page.cic-register.discomfort.slight = 'Leve'
page.cic-register.discomfort.pain = 'Dolor'
page.cic-register.discomfort.note-label = 'Describe el dolor (opcional)'
page.cic-register.discomfort.note-placeholder = 'Ej: Dolor al inicio del cateterismo'

// Summary step
page.cic-register.summary.title = 'Resumen del registro'
page.cic-register.summary.description = 'Confirma que todo es correcto antes de guardar'
page.cic-register.summary.volume-label = 'Volumen'
page.cic-register.summary.color-label = 'Color'
page.cic-register.summary.turbidity-label = 'Turbidez'
page.cic-register.summary.discomfort-label = 'Molestias'
page.cic-register.summary.notes-label = 'Notas (opcional)'
page.cic-register.summary.notes-placeholder = 'Añade notas adicionales si lo deseas'
page.cic-register.summary.save-button = 'Guardar registro'
page.cic-register.summary.success = 'Registro guardado correctamente'
page.cic-register.summary.error = 'Error al guardar el registro'
```

## Register Selector Modal

```typescript
// page.register-selector.* (Modal to choose routine type)
page.register-selector.title = '¿Qué quieres registrar?'
page.register-selector.description = 'Selecciona el tipo de registro'

page.register-selector.cic.title = 'Cateterismo (CIC)'
page.register-selector.cic.description = 'Registrar un cateterismo intermitente'

page.register-selector.bowel.title = 'Deposición'
page.register-selector.bowel.description = 'Registrar una deposición'

page.register-selector.enema.title = 'Enema'
page.register-selector.enema.description = 'Registrar un enema'
page.register-selector.enema.disabled = 'Módulo no activo'

page.register-selector.medication.title = 'Medicación'
page.register-selector.medication.description = 'Registrar medicación administrada'
page.register-selector.medication.disabled = 'Módulo no activo'

page.register-selector.cancel = 'Cancelar'
```

## Shared Components

```typescript
// component.child-card.* (Child info card - appears in report and settings)
component.child-card.age = '{age} años'
component.child-card.no-age = 'Edad no especificada'
component.child-card.status.green = '● Verde'
component.child-card.status.yellow = '● Amarillo'
component.child-card.status.red = '● Rojo'
component.child-card.tap-to-view = 'Pulsar para ver perfil'

// component.status-indicator.* (Status badge - appears in report and register)
component.status-indicator.green = 'Todo dentro de lo esperado'
component.status-indicator.yellow = 'Requiere atención'
component.status-indicator.red = 'Atención urgente'
component.status-indicator.unknown = 'Estado desconocido'

// component.stats-summary.* (Day stats - appears in report)
component.stats-summary.title = 'Resumen del día'
component.stats-summary.cic = 'CIC'
component.stats-summary.bowel = 'Deposiciones'
component.stats-summary.enemas = 'Enemas'
component.stats-summary.medications = 'Medicaciones'
component.stats-summary.no-records = 'Sin registros hoy'

// component.next-action-card.* (Next action reminder - appears in report and register)
component.next-action-card.title = 'Próxima acción'
component.next-action-card.catheterization-in = 'Cateterismo en {time}'
component.next-action-card.bowel-in = 'Deposición estimada en {time}'
component.next-action-card.medication-in = 'Medicación en {time}'
component.next-action-card.no-pending = 'No hay acciones pendientes'
component.next-action-card.overdue = 'Acción pendiente (retrasada {time})'

// component.record-card.* (Record preview card - appears in various screens)
component.record-card.cic = 'Cateterismo (CIC)'
component.record-card.bowel = 'Deposición'
component.record-card.enema = 'Enema'
component.record-card.medication = 'Medicación'
component.record-card.time-ago = 'hace {time}'
component.record-card.tap-to-view = 'Pulsar para ver detalle'
component.record-card.no-records = 'No hay registros'
```

## Time Formatting (used with {time} placeholders)

```typescript
// time.* (Relative time formatting)
time.minutes = '{count} min'
time.hours = '{count}h'
time.hours-minutes = '{hours}h {minutes}min'
time.days = '{count} días'
time.weeks = '{count} semanas'
time.months = '{count} meses'
time.just-now = 'ahora mismo'
time.yesterday = 'ayer'
time.today = 'hoy'
```

## Accessibility Labels

```typescript
// a11y.* (Accessibility labels for screen readers)
a11y.tab.register = 'Pestaña de registro de rutinas'
a11y.tab.report = 'Pestaña de reportes e historial'
a11y.tab.settings = 'Pestaña de configuración'

a11y.button.register-now = 'Botón para abrir selector de registro'
a11y.button.view-history = 'Ver historial de registros'
a11y.button.view-calendar = 'Ver calendario de registros'
a11y.button.add-carer = 'Añadir nuevo cuidador'
a11y.button.show-qr = 'Mostrar código QR para compartir'

a11y.card.child-info = 'Información del niño o niña'
a11y.card.next-action = 'Recordatorio de próxima acción'
a11y.card.day-summary = 'Resumen de registros del día'
a11y.card.last-record = 'Último registro realizado'

a11y.wizard.step = 'Paso {current} de {total}'
a11y.wizard.next = 'Siguiente paso'
a11y.wizard.back = 'Paso anterior'
```

## Implementation Notes

1. **Placeholder Syntax:** Use `{variable}` for dynamic values (e.g., `{time}`, `{name}`, `{count}`)
2. **Hierarchical Keys:** Group related keys with dot notation for clarity
3. **Accessibility First:** Always include corresponding `a11y.*` keys for screen readers
4. **Spanish Primary:** Maintain Spanish as the primary language with high-quality content
5. **Consistency:** Use consistent terminology across all screens (e.g., "CIC" not "cateterismo" in some places)

## Next Steps

- [ ] Create `es-ES.ts` with Spanish translations (primary language)
- [ ] Create `en-EN.ts` with English translations
- [ ] Add to existing i18n configuration
- [ ] Validate all keys are used in implementation
- [ ] Test with i18next missing key warnings enabled
