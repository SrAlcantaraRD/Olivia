import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';
export const esES = Object.freeze({
  welcome: 'Bienvenido',
  next: 'Siguiente',
  parent: 'Progenitor',
  caregiver: 'Cuidador',
  finish: 'Finalizar',
  skip: 'Saltar',
  continue: 'Continuar',
  'start-onboarding': 'Comenzar',
  'add-register': 'Añadir registro',

  // Common
  'common.raw-value': '{{value}}',
  'common.back': 'Atrás',
  'common.next': 'Siguiente',
  'common.cancel': 'Cancelar',
  'common.save': 'Guardar',
  'common.edit': 'Editar',
  'common.delete': 'Eliminar',
  'common.confirm': 'Confirmar',
  'common.loading': 'Cargando...',
  'common.error': 'Error',
  'common.success': 'Éxito',
  'error.no-carer-found': 'No se encontró cuidador',
  'hook.get-record-statistics.error':
    'Error al cargar estadísticas de registros',
  'common.optional': 'Opcional',
  'common.required': 'Obligatorio',
  'common.view-all': 'Ver todo',

  // Tab navigation
  'tab.register': 'Registro',
  'tab.report': 'Reporte',
  'tab.summary': 'Resumen',
  'tab.settings': 'Configuración',

  // Page: Register Tab
  'page.register.title': 'Registro',
  'page.register.subtitle': 'Registra cateterismos, deposiciones y medicación',
  'page.register.quick-actions': 'Acciones rápidas',
  'page.register.recent-activity': 'Actividad reciente',
  'page.register.no-recent-activity': 'No hay actividad reciente',

  // Page: Report Tab
  'page.report.title': 'Reporte',
  'page.report.subtitle': 'Visualiza estadísticas y el historial',
  'page.report.filters': 'Filtros',
  'page.report.statistics': 'Estadísticas',
  'page.report.history': 'Historial',
  'page.report.no-history': 'No hay registros en el historial',

  // Page: Summary Tab
  'page.summary.title': 'Resumen',
  'page.summary.subtitle': 'Vista rápida de datos de salud',
  'page.summary.section.pinned': 'Datos fijados',
  'page.summary.section.modules': 'Módulos',
  'page.summary.pins-empty': 'Fija elementos para verlos aquí',
  'page.summary.modules-empty': 'No hay módulos para mostrar',
  'page.summary.today-count': 'Hoy: {{value}}',
  'page.summary.metric-label.today': 'Hoy',
  'page.summary.metric-label.steps': 'pasos',
  'page.summary.all-data': 'Mostrar todos los datos de salud',
  'page.summary.trends': 'Tendencias',
  'page.summary.highlights': 'Datos importantes',

  // Page: Summary All Data
  'page.summary-all-data.title': 'Todos los datos de salud',
  'page.summary-all-data.subtitle': 'Explora módulos y detalles',
  'page.summary-all-data.heading': 'Módulos activos',
  'page.summary-all-data.empty': 'No hay módulos activos todavía',

  // Page: Summary Trends
  'page.summary-trends.title': 'Tendencias',
  'page.summary-trends.subtitle': 'Patrones y cambios detectados',
  'page.summary-trends.heading': 'Tendencias recientes',
  'page.summary-trends.empty': 'No hay tendencias disponibles',

  // Page: Summary Highlights
  'page.summary-highlights.title': 'Datos importantes',
  'page.summary-highlights.subtitle': 'Insights relevantes',
  'page.summary-highlights.heading': 'Datos importantes',
  'page.summary-highlights.empty': 'No hay datos importantes aún',

  // Page: Summary Detail
  'page.summary-detail.title': 'Detalle de resumen',
  'page.summary-detail.subtitle': 'Vista detallada',
  'page.summary-detail.heading': 'Información detallada',
  'page.summary-detail.average-label': 'Promedio',
  'page.summary-detail.range-placeholder': '7-13 dic 2025',
  'page.summary-detail.trend': 'Tendencia',
  'page.summary-detail.trend-empty': 'No disponible',
  'page.summary-detail.highlights': 'Datos importantes',
  'page.summary-detail.fields': 'Campos',
  'page.summary-detail.fields-empty': 'No hay campos disponibles',
  'page.summary-detail.empty': 'No hay datos para este periodo',
  'page.summary-detail.actions': 'Acciones',
  'page.summary-detail.pin': 'Fijar en Resumen',
  'page.summary-detail.unpin': 'Quitar de Resumen',
  'page.summary-detail.back-to-module': 'Volver al módulo',
  'page.summary-detail.back-to-summary': 'Volver a Resumen',

  // Summary Trends (fake data)
  'summary.trend.cic.up.title': 'CIC en aumento en las últimas semanas',
  'summary.trend.cic.up.description': 'Tu recuento de CIC ha subido.',
  'summary.trend.stool.stable.title': 'Patrón de deposiciones estable',
  'summary.trend.stool.stable.description':
    'La frecuencia de deposiciones se mantiene.',

  // Summary Highlights (fake data)
  'summary.highlight.cic.high.title': 'CIC por encima de lo habitual',
  'summary.highlight.cic.high.description':
    'La media de CIC está por encima del rango habitual.',
  'summary.highlight.urine.up.title': 'Volumen de orina en aumento',
  'summary.highlight.urine.up.description':
    'El volumen diario de orina muestra una subida.',

  // Summary Detail placeholders
  'summary.detail.comparison.default': 'Comparado con tu media',
  'summary.detail.projection.default': 'Proyección no disponible aún',

  // Page: History Detail
  'page.history-detail.title': 'Detalle del Historial',
  'page.history-detail.subtitle': 'Vista detallada de tus registros',
  'page.history-detail.placeholder':
    'Contenido del historial detallado próximamente',
  'page.history-detail.select-field': 'Selecciona un campo',
  'page.history-detail.no-fields': 'No hay campos disponibles para este módulo',
  'page.history-detail.no-data':
    'No hay datos para este campo en el rango seleccionado',

  // Page: Settings Tab
  'page.settings.title': 'Configuración',
  'page.settings.subtitle': 'Gestiona el perfil, cuidadores y ajustes',
  'page.settings.section-child': 'Niño/a',
  'page.settings.section-carers': 'Cuidadores',
  'page.settings.section-app': 'Aplicación',
  'page.settings.section-danger': 'Zona de peligro',
  'page.settings.child-profile': 'Perfil del niño/a',
  'page.settings.child-profile-desc': 'Datos personales y diagnóstico',
  'page.settings.manage-carers': 'Gestionar cuidadores',
  'page.settings.manage-carers-desc': 'Añade o elimina cuidadores',
  'page.settings.app-settings': 'Ajustes de la app',
  'page.settings.app-settings-desc': 'Tema, idioma y privacidad',
  'page.settings.about': 'Acerca de',
  'page.settings.about-desc': 'Versión e información legal',
  'page.settings.add-demo-data': 'Añadir Datos de Demo',
  'page.settings.add-demo-data-desc':
    'Añadir registros de muestra para pruebas',
  'page.settings.logout': 'Cerrar sesión',

  // Page: Settings Detail Screens
  'page.child-profile.title': 'Perfil del Niño/a',
  'page.child-profile.placeholder': 'Formulario de perfil próximamente',
  'page.carer-management.title': 'Gestión de Cuidadores',

  'page.carer-management.description':
    'Invita a cuidadores secundarios para compartir registros de forma segura.',
  'page.carer-management.list-empty':
    'Aún no hay cuidadores. Configura primero el cuidador principal.',
  'page.carer-management.sync-button': 'Sincronizar',
  'page.carer-management.card.status-active': 'Activo',
  'page.carer-management.card.status-inactive': 'Inactivo',
  'page.carer-management.card.primary': 'Cuidador principal',
  'page.carer-management.card.secondary': 'Cuidador secundario',
  'page.carer-management.card.health': 'Cuidador sanitario',
  'page.carer-management.card.unknown': 'Cuidador desconocido',
  'page.carer-management.invitation-modal.title': 'Bundle de invitación',
  'page.carer-management.invitation-modal.copy': 'Copiar chunk',
  'page.carer-management.invitation-modal.close': 'Cerrar',
  'page.carer-management.ttl-expired.title': 'Invitación expirada',
  'page.carer-management.ttl-expired.description':
    'Esta invitación ha expirado y ya no puede ser utilizada.',
  'page.carer-management.ttl-expired.sync': 'Sincronizar con cuidador',
  'page.carer-management.invitation-modal.generate': 'Generar QR',
  'page.carer-management.invitation-modal.generating': 'Generando código QR...',
  'page.app-settings.title': 'Configuración de la App',
  'page.app-settings.subtitle': 'Personaliza tu experiencia en la app',
  'page.app-settings.section-theme': 'Tema',
  'page.app-settings.section-language': 'Idioma',
  'page.app-settings.language.english': 'Inglés',
  'page.app-settings.language.spanish': 'Español',
  'page.app-settings.language.catalan': 'Catalán',
  'page.app-settings.action.switch-to-dark': 'Cambiar a Modo Oscuro',
  'page.app-settings.action.switch-to-light': 'Cambiar a Modo Claro',

  // About screen
  'page.about.title': 'Acerca de',
  'page.about.placeholder': 'Versión e información legal',

  // Página: Confirmación de borrado / logout
  'page.settings.logout-confirm.title': 'Esta acción es irreversible',
  'page.settings.logout-confirm.warning':
    'Se eliminarán todos los datos almacenados en este dispositivo asociados a este perfil. No podrás recuperarlos después.',
  'page.settings.logout-confirm.summary-title': 'Resumen de tu información',
  'page.settings.logout-confirm.time-registered': 'Tiempo registrado',
  'page.settings.logout-confirm.total-records': 'Registros totales',
  'page.settings.logout-confirm.cic': 'CIC',
  'page.settings.logout-confirm.stools': 'Deposiciones',
  'page.settings.logout-confirm.enemas': 'Enemas',
  'page.settings.logout-confirm.medication': 'Medicación',
  'page.settings.logout-confirm.confirm-question':
    '¿Estás seguro de que deseas borrar todo? Esta operación no se puede deshacer.',
  'page.settings.logout-confirm.delete-warning':
    'Solicitud de borrado recibida',
  'page.settings.logout-confirm.time-registered-value': '{{count}} días',
  'page.settings.logout-confirm.total-records-value': '{{count}}',
  'common.number': '{{value}}',

  // Page: CIC Registration Wizard - Volume
  'page.cic-register.volume.title': 'Volumen de orina',
  'page.cic-register.volume.description': 'Selecciona el volumen observado',
  'page.cic-register.volume.low': 'Bajo',
  'page.cic-register.volume.normal': 'Normal',
  'page.cic-register.volume.high': 'Alto',

  // Page: CIC Registration Wizard - Color
  'page.cic-register.color.title': 'Color de la orina',
  'page.cic-register.color.description': 'Selecciona el color observado',
  'page.cic-register.color.transparent': 'Transparente',
  'page.cic-register.color.light-yellow': 'Amarillo claro',
  'page.cic-register.color.dark-yellow': 'Amarillo oscuro',
  'page.cic-register.color.abnormal': 'Anómalo',

  // Page: CIC Registration Wizard - Turbidity
  'page.cic-register.turbidity.title': 'Turbidez',
  'page.cic-register.turbidity.description': 'Selecciona la turbidez observada',
  'page.cic-register.turbidity.clear': 'Clara',
  'page.cic-register.turbidity.slight': 'Leve',
  'page.cic-register.turbidity.high': 'Alta',

  // Page: CIC Registration Wizard - Discomfort
  'page.cic-register.discomfort.title': '¿Hubo molestias?',
  'page.cic-register.discomfort.description':
    'Indica si el niño/a presentó molestias',
  'page.cic-register.discomfort.none': 'No',
  'page.cic-register.discomfort.slight': 'Leve',
  'page.cic-register.discomfort.pain': 'Dolor',
  'page.cic-register.discomfort.note-label': 'Describe el dolor (opcional)',
  'page.cic-register.discomfort.note-placeholder':
    'Ej: Dolor al inicio del cateterismo',

  // Page: CIC Registration Wizard - Summary
  'page.cic-register.summary.title': 'Resumen del registro',
  'page.cic-register.summary.description':
    'Confirma que todo es correcto antes de guardar',
  'page.cic-register.summary.volume-label': 'Volumen',
  'page.cic-register.summary.color-label': 'Color',
  'page.cic-register.summary.turbidity-label': 'Turbidez',
  'page.cic-register.summary.discomfort-label': 'Molestias',
  'page.cic-register.summary.notes-label': 'Notas adicionales (opcional)',
  'page.cic-register.summary.notes-placeholder':
    'Añade notas adicionales si lo deseas',
  'page.cic-register.summary.save-button': 'Guardar registro',
  'page.cic-register.summary.success': 'Registro guardado correctamente',
  'page.cic-register.summary.error': 'Error al guardar el registro',

  // Components
  'component.register-cic-button.label': 'Registrar Cateterismo (CIC)',
  'component.register-cic-button.subtitle': 'Cateterismo Intermitente Limpio',
  'component.register-cic-button.description':
    'Registra volumen, color e incomodidad',
  'component.register-stool-button.label': 'Registrar Deposición',
  'component.register-stool-button.subtitle': 'Movimiento Intestinal',
  'component.register-stool-button.description':
    'Seguimiento de consistencia y frecuencia',
  'component.register-medication-button.label': 'Registrar Medicación',
  'component.register-medication-button.subtitle':
    'Administración de Medicinas',
  'component.register-medication-button.description':
    'Registra medicación y dosis',
  'component.filter-button.label': 'Filtros',
  'component.filter-button.all-types': 'Todos los tipos',
  'component.stat-card.cic-label': 'Cateterismos',
  'component.stat-card.stool-label': 'Deposiciones',
  'component.stat-card.medication-label': 'Medicación',
  'component.stat-card.today': 'Hoy',

  // Accessibility
  'a11y.button.register-cic': 'Botón para registrar cateterismo',
  'a11y.button.register-stool': 'Botón para registrar deposición',
  'a11y.button.register-medication': 'Botón para registrar medicación',
  'a11y.button.open-filters': 'Abrir filtros',
  'a11y.button.view-all-history': 'Ver todo el historial',
  'a11y.button.child-profile': 'Ver perfil del niño',
  'a11y.button.manage-carers': 'Gestionar cuidadores',
  'a11y.button.app-settings': 'Ajustes de la aplicación',
  'a11y.button.about': 'Acerca de',
  'a11y.button.logout': 'Cerrar sesión',
  'a11y.hint.opens-cic-form': 'Abre el formulario de registro de cateterismo',
  'a11y.hint.opens-stool-form': 'Abre el formulario de registro de deposición',
  'a11y.hint.opens-medication-form':
    'Abre el formulario de registro de medicación',
  'a11y.hint.opens-filter-modal': 'Abre la modal de filtros',
  'a11y.hint.opens-child-profile': 'Abre la pantalla de perfil del niño',
  'a11y.hint.opens-carer-management':
    'Abre la pantalla de gestión de cuidadores',
  'a11y.hint.opens-app-settings':
    'Abre la pantalla de ajustes de la aplicación',
  'a11y.hint.opens-about': 'Abre la pantalla acerca de',
  'a11y.hint.logout-action': 'Cierra tu sesión actual',
  // Modal Screen
  'modal.title': 'Esto es un modal',
  'modal.go-home': 'Ir a la pantalla principal',
  // Caregiver Setup
  'caregiver-setup.scan-qr.title': 'Escanear código QR',
  'page.caregiver-setup.scan-qr.camera-hint':
    'Mantén el QR dentro del marco para capturar cada chunk automáticamente.',
  'page.caregiver-setup.scan-qr.camera-permission':
    'Permite el acceso a la cámara para escanear el bundle de forma automática.',
  'page.caregiver-setup.scan-qr.camera-request': 'Conceder acceso a la cámara',
  'page.caregiver-setup.scan-qr.instructions':
    'Escanea el QR de invitación o pega cada chunk aquí.',
  'page.caregiver-setup.scan-qr.input.placeholder': 'Pega el JSON del chunk',
  'page.caregiver-setup.scan-qr.add-chunk': 'Agregar chunk',
  'page.caregiver-setup.scan-qr.reset': 'Reiniciar escáner',
  'page.caregiver-setup.scan-qr.status':
    '{{count}} de {{total}} chunks escaneados',
  'page.caregiver-setup.scan-qr.chunk-item': 'Chunk {{index}} de {{total}}',
  'page.caregiver-setup.scan-qr.error.invalid-chunk':
    'Chunk inválido. Intenta nuevamente.',
  'caregiver-setup.confirm-link.title': 'Confirmar enlace',
  'page.caregiver-setup.confirm-link.subtitle':
    'El cuidador secundario se vinculó con éxito.',
  'page.caregiver-setup.confirm-link.details':
    'El cuidador <bold>{{name}}</bold> ya puede ver los registros compartidos.',
  'page.caregiver-setup.confirm-link.go-home': 'Ir al panel',
  // Modals
  'modal.add-carer.title': 'Añadir Cuidador (Generar QR)',
  'modal.filter-history.title': 'Filtrar Historial',
  'modal.quick-record.title': 'Registro Rápido',
  'modal.reminders.title': 'Recordatorios',
  'modal.switch-account.title': 'Cambiar de Cuenta',
  'modal.symptom-alert.title': 'Alerta de Síntomas',

  // Splash Screen
  'splash-screen.app-name': 'Oliva',
  'splash-screen.tagline': 'Cuidar. Registrar. Respirar.',
  'splash-screen.privacy-notice': 'Tus datos se guardan solo en tu teléfono',
  // Onboarding
  'onboarding-screen.slider.care-with-peace.title':
    'Te ayudamos a cuidar con tranquilidad.',
  'onboarding-screen.slider.care-with-peace.description':
    'Registra cateterismos y rutinas de forma rápida, clara y sin conexión.',
  'onboarding-screen.slider.slogan.title':
    'Rápido. Guiado. Pensado para tu día a día.',
  'onboarding-screen.slider.slogan.bullet.record-in-seconds':
    'Registro en segundos',
  'onboarding-screen.slider.slogan.bullet.one-step-at-a-time':
    'Un paso cada vez',
  'onboarding-screen.slider.slogan.bullet.perfect-for-busy-routines':
    'Perfecto para rutinas con prisas',
  'onboarding-screen.slider.data-control.title': 'Tus datos, bajo tu control.',
  'onboarding-screen.slider.data-control.description':
    'Todo queda en tu teléfono. Sin nube. Sin cuentas.\nTú decides con quién compartir.',
  // Role Selection Screen
  'role-selection-screen.title': '¿Cómo quieres empezar?',
  'role-selection-screen.description': 'Elige tu rol para configurar la app.',
  'role-selection-screen.parent.title': 'Progenitor / Tutor',
  'role-selection-screen.parent.subtitle': 'Cuidador principal',
  'role-selection-screen.parent.description':
    'Registra y gestiona rutinas y cateterismos para tus hijos.',
  'role-selection-screen.caregiver.title': 'Cuidador / Profesional',
  'role-selection-screen.caregiver.subtitle': 'Apoyo o profesional sanitario',
  'role-selection-screen.caregiver.description':
    'Conecta con familias y registra intervenciones.',
  // Parent Setup
  'parent-setup.parent-info.title': 'Sobre ti',
  'parent-setup.parent-info.description':
    'Datos básicos del cuidador principal.',
  'parent-setup.parent-info.name-label': 'Nombre:',
  'parent-setup.parent-info.name-placeholder': 'Tu nombre',
  'parent-setup.parent-info.relationship-label': 'Relación:',
  'parent-setup.parent-info.parent': 'Padre / Madre',
  'parent-setup.parent-info.guardian': 'Tutor',
  'parent-setup.child-info.title': 'Sobre el niño',
  'parent-setup.child-info.description':
    'Datos básicos del menor para identificarlo.',
  'parent-setup.child-info.name-label': 'Nombre:',
  'parent-setup.child-info.name-placeholder': 'Nombre del niño/a',
  'parent-setup.child-info.birth-date-label': 'Fecha de nacimiento:',
  'parent-setup.child-info.birth-date-placeholder': 'DD / MM / AAAA',
  'parent-setup.child-info.diagnosis-label': 'Diagnóstico:',
  'parent-setup.child-info.diagnosis-placeholder': 'Diagnóstico médico',
  'parent-setup.child-info.diagnosis-hint':
    'Opcional: Puedes añadirlo más tarde si lo prefieres.',
  'parent-setup.modules.title': '¿Qué módulos necesitas?',
  'parent-setup.modules.description':
    'Activa los módulos que vas a utilizar. Puedes modificarlos después en el perfil del menor.',
  'parent-setup.modules.catheterization.title': 'Cateterismos',
  'parent-setup.modules.catheterization.description':
    'Manejo de cateterismos y registros CIC.',
  'parent-setup.modules.bowel-movements.title': 'Deposiciones',
  'parent-setup.modules.bowel-movements.description':
    'Registro de deposiciones y seguimiento.',
  'parent-setup.modules.enemas.title': 'Enemas',
  'parent-setup.modules.enemas.description':
    'Opcional, según necesidades clínicas.',
  'parent-setup.modules.urine.title': 'Orina',
  'parent-setup.modules.urine.description':
    'Seguimiento de volumen y características de la orina.',
  'parent-setup.modules.medication.title': 'Medicación',
  'parent-setup.modules.medication.description':
    'Registro de administración de medicamentos.',
  'parent-setup.modules.unknown.title': 'Módulo desconocido',
  'parent-setup.modules.unknown.description':
    'Descripción del módulo desconocido',
  'parent-setup.summary.title': 'Revisa tu información',
  'parent-setup.summary.description':
    'Confirma que todo es correcto antes de continuar',
  'parent-setup.summary.parent-section': 'Información del Tutor',
  'parent-setup.summary.parent-name': 'Nombre: <bold>{{value}}</bold>',
  'parent-setup.summary.parent-relationship':
    'Relación: <bold>{{value}}</bold>',
  'parent-setup.summary.child-section': 'Información del Menor',
  'parent-setup.summary.child-name': 'Nombre: <bold>{{value}}</bold>',
  'parent-setup.summary.child-birth-date':
    'Fecha de nacimiento: <bold>{{value}}</bold>',
  'parent-setup.summary.child-diagnosis': 'Diagnóstico',
  'parent-setup.summary.modules-section': 'Módulos Activados',
  'parent-setup.summary.no-modules': 'No se seleccionaron módulos',

  'page.report.debug-stats': 'Depurar: estadísticas',
  'page.report.debug-trendItems': 'Depurar: elementos de tendencia',

  // History detail ranges
  'page.history-detail.range.today': 'Hoy',
  'page.history-detail.range.7d': 'Últimos 7 días',
  'page.history-detail.range.30d': 'Últimos 30 días',
  'page.history-detail.range.90d': 'Últimos 90 días',

  // Summary
  'page.summary-detail.period.day': 'D',
  'page.summary-detail.period.week': 'S',
  'page.summary-detail.period.month': 'M',
  'page.summary-detail.period.half-year': '6M',
  'page.summary-detail.period.year': 'A',

  'hook.setup-parent.title': 'Configurando progenitor',
  'hook.setup-parent.description':
    'Por favor espera mientras configuramos tu cuenta.',
  'hook.setup-parent.error-title': 'Configuración Fallida',
  'hook.setup-parent.success-title': 'Configuración Exitosa',
  'hook.import-invite.description':
    'Validando el bundle antes de agregar al cuidador secundario.',
  'hook.import-invite.success-title': 'Invitación importada',
  'hook.import-invite.success-description':
    'Cuidado secundario agregado con éxito.',
  'hook.import-invite.error-title': 'Error al importar',
  'hook.import-invite.error-description':
    'No se pudo importar la invitación. Inténtalo de nuevo.',
  'hook.get-list-active-module.title': 'Cargando Módulos',
  'hook.get-list-active-module.description':
    'Por favor espera mientras cargamos módulos.',
  'hook.get-list-active-module.error-title': 'Error al Cargar Módulos',
  'hook.get-list-active-module.success-title': 'Módulos Cargados Exitosamente',
  'hook.get-list-module-field.error-title': 'Error al Cargar Campos del Módulo',
  'error.on-get-entity-by-id': 'Error Obteniendo Entidad por ID',

  'hook.get-record-trend.error': 'Error obteniendo tendencia de registros',

  'test.reset-db': 'Restablecer Base de Datos para Pruebas',
  'hook.create-record.error-title': 'Error al Crear Registro',
  'hook.create-record.success-title': 'Registro Creado Exitosamente',
  'hook.add-demo-data.error-title': 'Error al Añadir Datos de Demo',
  'hook.add-demo-data.success-title': 'Datos de Demo Añadidos Exitosamente',
  'hook.add-demo-data.success-description':
    'Los datos de demo se han añadido exitosamente',
  'hook.add-demo-data.error-description':
    'Ocurrió un error al añadir los datos de demo',
  'hook.get-record-field-distribution.error':
    'Error obteniendo distribución del campo',
  'page.settings.section-configuration': 'Configuración',
  'time-to-live.one-day': '1 día',
  'time-to-live.one-week': '1 semana',
  'time-to-live.one-month': '1 mes',
  'hook.create-secondary-carer.title': 'Creando cuidador',
  'hook.create-secondary-carer.error-title': 'No se pudo crear el cuidador',
  'hook.create-secondary-carer.error-description':
    'Inténtalo de nuevo más tarde para añadir el cuidador secundario.',
  'hook.create-secondary-carer.success-title': 'Cuidador creado',
  'hook.create-secondary-carer.success-description':
    'El cuidador secundario está listo para invitaciones.',
  'hook.delete-carer.title': 'Eliminando cuidador',
  'hook.delete-carer.description':
    'Estamos eliminando este cuidador de forma segura.',
  'hook.delete-carer.error-title': 'Eliminación fallida',
  'hook.delete-carer.error-description':
    'No pudimos eliminar el cuidador en este momento.',
  'hook.delete-carer.success-title': 'Cuidador eliminado',
  'hook.delete-carer.success-description':
    'El cuidador está ahora inactivo y oculto para sincronización.',
  'hook.create-carer.title': 'Creando cuidador',
  'hook.create-carer.description':
    'Estamos creando este cuidador de forma segura.',
  'hook.create-carer.error-title': 'Creación fallida',
  'hook.create-carer.error-description':
    'No pudimos crear el cuidador en este momento.',
  'hook.create-carer.success-title': 'Cuidador creado',
  'hook.create-carer.success-description': 'El cuidador está ahora activo.',
  'hook.sync-with-carer.title': 'Sincronizando datos',
  'hook.sync-with-carer.description': 'Importando registros desde QR.',
  'hook.sync-with-carer.error-title': 'Sincronización fallida',
  'hook.sync-with-carer.error-description':
    'No pudimos sincronizar los registros. Inténtalo de nuevo.',
  'hook.sync-with-carer.success-title': 'Sincronización registrada',
  'hook.sync-with-carer.success-description':
    'El evento de sincronización se ha registrado correctamente.',
  'page.carer-detail.heading': 'Detalles del cuidador',
  'page.carer-detail.name-value': 'Nombre: <bold>{{name}}</bold>',
  'page.carer-detail.ttl':
    'TTL: <bold>{{ttl}}</bold> · Expira EL {{expiresAt}}',
  'page.carer-detail.analysis-button': 'Ver datos importados (próximamente)',
  'page.carer-detail.sync-history.title': 'Historial de sincronización',
  'page.carer-detail.sync-history.empty':
    'Aún no hay sincronizaciones registradas.',
  'page.carer-detail.history.record':
    '{{timestamp}} · {{status}} · {{records}} registros · {{details}}',
  'page.carer-detail.history.status.success': 'Éxito',
  'page.carer-detail.history.status.failure': 'Fallo',
  'page.carer-management.invite-button': 'Invitar vía QR',
  'page.carer-management.detail-button': 'Ver detalles',
  'page.carer-management.delete-button': 'Eliminar',
  'page.carer-management.invitation-modal.subtitle':
    'Establece un TTL, genera el bundle QR, y compártelo de forma segura con el dispositivo secundario.',
  'page.carer-management.ttl.heading': 'Seleccionar TTL de invitación',
  'page.carer-management.invitation-modal.ttl':
    'TTL <bold>{{ttl}}</bold> · Expira en {{expiresAt}}',
  'page.carer-management.invitation-modal.bundle': 'Bundle: {{value}}',
  'page.carer-management.create-modal.title': 'Crear un cuidador secundario',
  'page.carer-management.create-modal.name-label': 'Nombre del cuidador',
  'page.carer-management.create-modal.name-placeholder': 'Introduce el nombre',
  'page.carer-management.create-modal.create': 'Crear cuidador',
  'page.carer-management.delete-modal.title': 'Eliminar cuidador secundario',
  'page.carer-management.delete-modal.subtitle':
    'Esta acción elimina suavemente al cuidador y previene nuevas sincronizaciones.',
  'page.carer-management.delete-modal.confirm': 'Confirmar eliminación',
  'use-case.generate-invitation-qr-for-secondary-carer.invalid-request':
    'Solicitud inválida para generar QR de invitación',
  'use-case.generate-invitation-qr-for-secondary-carer.generation-failed':
    'Fallo al generar QR de invitación',
  'use-case.create-carer.invalid-request':
    'Solicitud inválida para crear cuidador',
  'use-case.delete-carer.invalid-request':
    'Solicitud inválida para eliminar cuidador',
  'use-case.create-secondary-carer.invalid-request':
    'Solicitud inválida para crear cuidador secundario',
  'use-case.secondary-carer-consume-invitation-qr.invalid-qr-data':
    'Datos QR inválidos proporcionados',
  'use-case.secondary-carer-consume-invitation-qr.carer-exists':
    'El cuidador ya existe',
  'use-case.sync-with-carer.invalid-request':
    'Solicitud inválida para sincronizar con cuidador',

  'hook.create-secondary-carer.description':
    'Estamos creando un cuidador secundario de forma segura.',
  'hook.generate-invitation-qr-for-secondary-carer.description':
    'Generando el código QR de invitación para el cuidador secundario.',
  'hook.generate-invitation-qr-for-secondary-carer.error-description':
    'No pudimos generar el código QR. Inténtalo de nuevo.',
  'hook.generate-invitation-qr-for-secondary-carer.error-title':
    'Generación de código QR fallida',
  'hook.generate-invitation-qr-for-secondary-carer.success-description':
    'El código QR de invitación se ha generado correctamente.',
  'hook.generate-invitation-qr-for-secondary-carer.success-title':
    'Código QR generado',
  'hook.generate-invitation-qr-for-secondary-carer.title':
    'Generando código QR',
  'hook.import-invite.title': 'Importando invitación',
  'page.carer-detail.subtitle': 'Información y sincronizaciones del cuidador',
  'page.carer-detail.title': 'Detalles del Cuidador',
  'page.carer-management.create-secondary': 'Crear Cuidador Secundario',

  'page.carer-management.section.primary': 'Cuidador Principal',
  'page.carer-management.section.secondary': 'Cuidadores Secundarios',

  // Secondary Carer Setup
  'secondary-carer-setup.carer-info.title': 'Sobre ti',
  'secondary-carer-setup.carer-info.description':
    'Información básica sobre el cuidador secundario.',
  'secondary-carer-setup.carer-info.name-label': 'Nombre:',
  'secondary-carer-setup.carer-info.name-placeholder': 'Tu nombre',
  'secondary-carer-setup.carer-info.relationship-label':
    'Relación con el niño:',
  'secondary-carer-setup.carer-info.relationship-placeholder':
    'Seleccionar relación',
  'secondary-carer-setup.carer-info.relationship.family': 'Familiar',
  'secondary-carer-setup.carer-info.relationship.professional':
    'Profesional sanitario',
  'secondary-carer-setup.carer-info.relationship.other': 'Otro',
  'secondary-carer-setup.carer-info.notes-label':
    'Notas adicionales (opcional):',
  'secondary-carer-setup.carer-info.notes-placeholder':
    'Cualquier información adicional...',

  // Scan QR Step
  'secondary-carer-setup.scan-qr.title': 'Escanear QR de Invitación',
  'secondary-carer-setup.scan-qr.description':
    'Escanea el código QR de tu invitación para continuar con la configuración.',
  'secondary-carer-setup.scan-qr.progress': 'Progreso: {{progress}}',
  'secondary-carer-setup.scan-qr.manual.title':
    'O ingresa los datos del QR manualmente:',
  'secondary-carer-setup.scan-qr.manual.placeholder':
    'Pega los datos del fragmento QR aquí...',
  'secondary-carer-setup.scan-qr.manual.submit': 'Procesar Fragmento',

  // QR Info Step
  'secondary-carer-setup.qr-info.title': 'Detalles de la Invitación',
  'secondary-carer-setup.qr-info.description':
    'Revisa y confirma los detalles de la invitación.',
  'secondary-carer-setup.qr-info.invitation-details':
    'Detalles de la Invitación',
  'secondary-carer-setup.qr-info.name': 'Nombre Invitado',
  'secondary-carer-setup.qr-info.ttl': 'Tiempo de Vida',
  'secondary-carer-setup.qr-info.expires-at':
    'Expira el <bold>{{expiresAt}}</bold>',
  'secondary-carer-setup.qr-info.user-name':
    'Nombre del Cuidador: <bold>{{userName}}</bold>',
  'secondary-carer-setup.qr-info.form-title': 'Tu Información',

  'secondary-carer-setup.modules.title': 'Módulos Activos',
  'secondary-carer-setup.modules.description':
    'Revisa los módulos a los que tendrás acceso.',
  'secondary-carer-setup.modules.empty': 'No se encontraron módulos activos.',
  'secondary-carer-setup.modules.note':
    'Podrás ver y contribuir a estos módulos de salud.',
  'secondary-carer-setup.summary.title': 'Revisa tu información',
  'secondary-carer-setup.summary.description':
    'Confirma que todo es correcto antes de continuar',
  'secondary-carer-setup.summary.carer-name': 'Nombre',
  'secondary-carer-setup.summary.relationship': 'Relación',
  'secondary-carer-setup.summary.notes': 'Notas',
  'secondary-carer-setup.summary.modules-count': 'Módulos activos',
  'secondary-carer-setup.summary.terms': 'Acepto los términos y condiciones',
  'secondary-carer-setup.summary.confirmation-note':
    'Al continuar, aceptas compartir datos de salud de forma segura.',

  'page.caregiver-setup.scan-qr.permission.title':
    'Permiso de Cámara Requerido',
  'page.caregiver-setup.scan-qr.permission.description':
    'Necesitamos acceso a la cámara para escanear el código QR de invitación.',
  'page.caregiver-setup.scan-qr.permission.request':
    'Conceder Acceso a la Cámara',
} satisfies Record<Ti18nKeys, string>);
