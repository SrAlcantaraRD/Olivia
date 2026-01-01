import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export const esES = Object.freeze({
  welcome: 'Bienvenido',
  next: 'Siguiente',
  parent: 'Padre/Madre',
  caregiver: 'Cuidador',
  finish: 'Finalizar',
  skip: 'Saltar',
  continue: 'Continuar',
  'start-onboarding': 'Comenzar',
  'add-register': 'Añadir Registro',

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
    'Rápido. Guiado. Diseñado para tu día a día.',
  'onboarding-screen.slider.slogan.bullet.record-in-seconds':
    'Registra en segundos',
  'onboarding-screen.slider.slogan.bullet.one-step-at-a-time':
    'Un paso a la vez',
  'onboarding-screen.slider.slogan.bullet.perfect-for-busy-routines':
    'Perfecto para rutinas ocupadas',
  'onboarding-screen.slider.data-control.title': 'Tus datos, bajo tu control.',
  'onboarding-screen.slider.data-control.description':
    'Todo se queda en tu teléfono. Sin nube. Sin cuentas.\nTú decides con quién compartir.',

  // Role Selection Screen
  'role-selection-screen.title': '¿Cómo quieres empezar?',
  'role-selection-screen.description': 'Elige tu rol para configurar la app.',
  'role-selection-screen.parent.title': 'Padre / Madre / Tutor',
  'role-selection-screen.parent.subtitle': 'Cuidador principal',
  'role-selection-screen.parent.description':
    'Registra y gestiona las rutinas y cateterismos de tus hijos.',
  'role-selection-screen.caregiver.title': 'Cuidador / Profesional',
  'role-selection-screen.caregiver.subtitle': 'Apoyo o profesional sanitario',
  'role-selection-screen.caregiver.description':
    'Conéctate con familias y registra las intervenciones.',

  // Parent Setup
  'parent-setup.parent-info.title': 'Sobre ti',
  'parent-setup.parent-info.description':
    'Información básica sobre el cuidador principal.',
  'parent-setup.parent-info.name-label': 'Nombre:',
  'parent-setup.parent-info.name-placeholder': 'Tu nombre',
  'parent-setup.parent-info.relationship-label': 'Relación:',
  'parent-setup.parent-info.parent': 'Padre/Madre',
  'parent-setup.parent-info.guardian': 'Tutor',
  'parent-setup.child-info.title': 'Sobre el niño/a',
  'parent-setup.child-info.description':
    'Información básica del niño/a para su identificación.',
  'parent-setup.child-info.name-label': 'Nombre:',
  'parent-setup.child-info.name-placeholder': 'Nombre del niño/a',
  'parent-setup.child-info.birth-date-label': 'Fecha de nacimiento:',
  'parent-setup.child-info.birth-date-placeholder': 'DD / MM / AAAA',
  'parent-setup.child-info.diagnosis-label': 'Diagnóstico:',
  'parent-setup.child-info.diagnosis-placeholder': 'Diagnóstico médico',
  'parent-setup.child-info.diagnosis-hint':
    'Opcional: puedes añadirlo más tarde si lo prefieres.',
  'parent-setup.modules.title': '¿Qué módulos necesitas?',
  'parent-setup.modules.description':
    'Activa los módulos que vas a utilizar. Podrás modificarlos más tarde en el perfil del niño.',
  'parent-setup.modules.catheterization.title': 'Cateterismos (CIC)',
  'parent-setup.modules.catheterization.description':
    'Gestión de sondajes y registros de CIC.',
  'parent-setup.modules.bowel-movements.title': 'Deposiciones',
  'parent-setup.modules.bowel-movements.description':
    'Registro y seguimiento de deposiciones.',
  'parent-setup.modules.enemas.title': 'Enemas',
  'parent-setup.modules.enemas.description':
    'Opcional, según necesidades clínicas.',
  'parent-setup.modules.urine.title': 'Orina',
  'parent-setup.modules.urine.description':
    'Seguimiento de volumen y características de la orina.',
  'parent-setup.modules.medication.title': 'Medicación',
  'parent-setup.modules.medication.description':
    'Registro de administración de fármacos.',
  'parent-setup.modules.unknown.title': 'Módulo desconocido',
  'parent-setup.modules.unknown.description':
    'Descripción del módulo desconocido.',
  'parent-setup.summary.title': 'Revisa tu información',
  'parent-setup.summary.description':
    'Confirma que todo es correcto antes de continuar',
  'parent-setup.summary.parent-section': 'Información del cuidador',
  'parent-setup.summary.parent-name': 'Nombre: <bold>{{value}}</bold>',
  'parent-setup.summary.parent-relationship':
    'Relación: <bold>{{value}}</bold>',
  'parent-setup.summary.child-section': 'Información del niño/a',
  'parent-setup.summary.child-name': 'Nombre: <bold>{{value}}</bold>',
  'parent-setup.summary.child-birth-date':
    'Fecha de Nacimiento: <bold>{{value}}</bold>',
  'parent-setup.summary.child-diagnosis': 'Diagnóstico: <bold>{{value}}</bold>',
  'parent-setup.summary.modules-section': 'Módulos activados',
  'parent-setup.summary.no-modules': 'Ningún módulo seleccionado',

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
  'common.month.january': 'Enero',
  'common.month.february': 'Febrero',
  'common.month.march': 'Marzo',
  'common.month.april': 'Abril',
  'common.month.may': 'Mayo',
  'common.month.june': 'Junio',
  'common.month.july': 'Julio',
  'common.month.august': 'Agosto',
  'common.month.september': 'Septiembre',
  'common.month.october': 'Octubre',
  'common.month.november': 'Noviembre',
  'common.month.december': 'Diciembre',
  'common.day.sunday': 'Domingo',
  'common.day.monday': 'Lunes',
  'common.day.tuesday': 'Martes',
  'common.day.wednesday': 'Miércoles',
  'common.day.thursday': 'Jueves',
  'common.day.friday': 'Viernes',
  'common.day.saturday': 'Sábado',

  // Tab navigation
  'tab.register': 'Registro',
  'tab.report': 'Reporte',
  'tab.summary': 'Resumen',
  'tab.settings': 'Ajustes',

  'enum.module-field-key.color': 'Color',
  'enum.module-field-key.discomfort-level': 'Nivel de incomodidad',
  'enum.module-field-key.turbidity': 'Turbidez',
  'enum.module-field-key.volumen-level': 'Nivel de volumen',

  // Page: Register Tab
  'page.register.title': 'Registro',
  'page.register.subtitle': 'Registra cateterismos, deposiciones y medicación',
  'page.register.quick-actions': 'Acciones rápidas',
  'page.register.recent-activity': 'Actividad reciente',
  'page.register.no-recent-activity': 'No hay actividad reciente',

  // Page: Report Tab
  'page.report.title': 'Reporte',
  'page.report.subtitle': 'Visualiza estadísticas e historial',
  'page.report.filters': 'Filtros',
  'page.report.statistics': 'Estadísticas',
  'page.report.history': 'Historial',
  'page.report.no-history': 'No hay registros en el historial',

  // Page: Summary Tab
  'page.summary.title': 'Resumen',
  'page.summary.subtitle': 'Una vista rápida de los datos de salud',
  'page.summary.section.pinned': 'Datos fijados',
  'page.summary.section.modules': 'Módulos',
  'page.summary.section.can-interest-you': 'Te puede interesar',
  'page.summary.modules-empty': 'No hay resúmenes de módulos disponibles',
  'page.summary.today-count': 'Hoy: {{value}}',
  'page.summary.metric-label.today': 'Hoy',
  'page.summary.metric-label.total': 'Total',
  'page.summary.metric-label.steps': 'pasos',
  'page.summary.all-data': 'Mostrar todos los datos de salud',
  'page.summary.trends': 'Tendencias',
  'page.summary.highlights': 'Lo más destacado',

  // Page: Summary All Data
  'page.summary-all-data.title': 'Todos los datos de salud',
  'page.summary-all-data.subtitle': 'Explora módulos y detalles',
  'page.summary-all-data.heading': 'Módulos activos',
  'page.summary-all-data.empty': 'No hay módulos activos aún',

  // Page: Summary Trends
  'page.summary-trends.title': 'Tendencias',
  'page.summary-trends.subtitle': 'Patrones y cambios detectados',
  'page.summary-trends.heading': 'Tendencias recientes',
  'page.summary-trends.empty': 'No hay tendencias disponibles aún',

  // Page: Summary Highlights
  'page.summary_highlights.title': 'Destacados',
  'page.summary_highlights.subtitle': 'Información relevante',
  'page.summary_highlights.heading': 'Destacados',
  'page.summary_highlights.empty': 'No hay destacados disponibles aún',

  // Page: Summary Detail
  'page.summary-detail.title': 'Detalle de resumen',
  'page.summary-detail.subtitle': 'Vista de detalle',
  'page.summary-detail.heading': 'Información detallada',
  'page.summary-detail.average-label': 'Promedio',
  'page.summary-detail.range-placeholder': '7-13 Dic 2025',
  'page.summary-detail.trend': 'Tendencia',
  'page.summary-detail.trend-empty': 'No disponible',
  'page.summary-detail.highlights': 'Destacados',
  'page.summary-detail.fields': 'Campos',
  'page.summary-detail.fields-empty': 'No hay campos disponibles',
  'page.summary-detail.empty': 'No hay datos para este periodo',
  'page.summary-detail.actions': 'Acciones',
  'page.summary-detail.pin': 'Fijar en Resumen',
  'page.summary-detail.unpin': 'Quitar de Resumen',
  'page.summary-detail.back-to-module': 'Volver al módulo',
  'page.summary-detail.back-to-summary': 'Volver al Resumen',

  // Summary Trends (fake data)
  'summary.trend.cic.up.title': 'CIC en aumento en las últimas semanas',
  'summary.trend.cic.up.description':
    'Tu recuento de CIC ha subido últimamente.',
  'summary.trend.stool.stable.title': 'Patrón de deposiciones estable',
  'summary.trend.stool.stable.description':
    'La frecuencia de las deposiciones se ha mantenido estable.',

  // Summary Highlights (fake data)
  'summary.highlight.cic.high.title': 'CIC por encima de la media habitual',
  'summary.highlight.cic.high.description':
    'Tu promedio de CIC está por encima del rango habitual.',
  'summary.highlight.urine.up.title': 'El volumen de orina está aumentando',
  'summary.highlight.urine.up.description':
    'El volumen diario de orina muestra una tendencia al alza.',

  // Summary Detail placeholders
  'summary.detail.comparison.default': 'Comparado con tu promedio',
  'summary.detail.projection.default': 'Proyección no disponible todavía',

  // Page: History Detail
  'page.history-detail.title': 'Detalle del Historial',
  'page.history-detail.subtitle': 'Vista detallada de tus registros',
  'page.history-detail.placeholder':
    'El contenido detallado del historial estará disponible pronto',
  'page.history-detail.select-field': 'Selecciona un campo',
  'page.history-detail.no-fields': 'No hay campos disponibles para este módulo',
  'page.history-detail.no-data':
    'No hay datos para este campo en el rango de fechas seleccionado',

  // Page: Settings Tab
  'page.settings.title': 'Ajustes',
  'page.settings.subtitle': 'Gestiona perfil, cuidadores y ajustes de la app',
  'page.settings.section-child': 'Niño/a',
  'page.settings.section-carers': 'Cuidadores',
  'page.settings.section-configuration': 'Configuración',
  'page.settings.section-app': 'Aplicación',
  'page.settings.section-danger': 'Zona de peligro',
  'page.settings.child-profile': 'Perfil del niño/a',
  'page.settings.child-profile-desc': 'Datos personales y diagnóstico',
  'page.settings.manage-carers': 'Gestionar cuidadores',
  'page.settings.manage-carers-desc': 'Añadir o eliminar cuidadores',
  'page.settings.app-settings': 'Ajustes de la app',
  'page.settings.app-settings-desc': 'Tema, idioma y privacidad',
  'page.settings.about': 'Acerca de',
  'page.settings.about-desc': 'Versión e información legal',
  'page.settings.sync-records': 'Sincronizar Registros',
  'page.settings.sync-records-desc':
    'Comparte registros con otro dispositivo vía QR',
  'page.settings.add-demo-data': 'Añadir Datos de Demo',
  'page.settings.add-demo-data-desc':
    'Añadir registros de muestra para pruebas',
  'page.settings.logout': 'Cerrar sesión',
  'page.settings.logout-desc': 'Cerrar sesión y borrar datos locales',
  'page.settings.role.primary': 'Cuidador Principal',
  'page.settings.role.secondary': 'Cuidador Secundario',

  // Page: Settings Detail Screens
  'page.child-profile.title': 'Perfil del Niño/a',
  'page.child-profile.placeholder': 'Formulario de perfil disponible pronto',
  'page.carer-management.title': 'Gestión de Cuidadores',
  'page.carer-management.description':
    'Supervisa cuidadores principales y secundarios, comparte invitaciones QR y sincroniza registros de forma segura.',
  'page.carer-management.list-empty':
    'No hay cuidadores configurados aún. Crea uno para empezar a invitar o sincronizar.',
  'page.carer-management.create-secondary': 'Crear cuidador secundario',
  'page.carer-management.section.primary': 'Cuidadores principales',
  'page.carer-management.section.secondary': 'Cuidadores secundarios',
  'page.carer-management.card.primary': 'Cuidador principal',
  'page.carer-management.card.secondary': 'Cuidador secundario',
  'page.carer-management.card.health': 'Cuidador sanitario',
  'page.carer-management.card.unknown': 'Cuidador desconocido',
  'page.carer-management.card.status-active': 'Activo',
  'page.carer-management.card.status-inactive': 'Inactivo',
  'page.carer-management.invite-button': 'Invitar vía QR',
  'page.carer-management.sync-button': 'Sincronizar con cuidador',
  'page.carer-management.detail-button': 'Ver detalles',
  'page.carer-management.delete-button': 'Eliminar',
  'page.carer-management.invitation-modal.title': 'Bundle de invitación',
  'page.carer-management.invitation-modal.subtitle':
    'Establece un TTL, genera el bundle QR y compártelo de forma segura con el dispositivo secundario.',
  'page.carer-management.ttl.heading': 'Selecciona el TTL de la invitación',
  'page.carer-management.invitation-modal.generate': 'Generar QR',
  'page.carer-management.invitation-modal.generating': 'Generando código QR...',
  'page.carer-management.invitation-modal.ttl':
    'TTL <bold>{{ttl}}</bold> · Expira a las {{expiresAt}}',
  'page.carer-management.invitation-modal.bundle': 'Bundle: {{value}}',
  'page.carer-management.invitation-modal.copy': 'Copiar bundle',
  'page.carer-management.invitation-modal.close': 'Cerrar',
  'page.carer-management.ttl-expired.title': 'Invitación expirada',
  'page.carer-management.ttl-expired.description':
    'Esta invitación ha expirado y ya no puede utilizarse.',
  'page.carer-management.ttl-expired.sync': 'Sincronizar con cuidador',
  'page.carer-management.create-modal.title': 'Crear cuidador secundario',
  'page.carer-management.create-modal.name-label': 'Nombre del cuidador',
  'page.carer-management.create-modal.name-placeholder': 'Introduce el nombre',
  'page.carer-management.create-modal.create': 'Crear cuidador',
  'page.carer-management.delete-modal.title': 'Eliminar cuidador secundario',
  'page.carer-management.delete-modal.subtitle':
    'Esta acción realiza un borrado lógico del cuidador y evita nuevas sincronizaciones.',
  'page.carer-management.delete-modal.confirm': 'Confirmar eliminación',
  'time-to-live.one-day': '1 día',
  'time-to-live.one-week': '1 semana',
  'time-to-live.one-month': '1 mes',
  'hook.delete-carer.title': 'Eliminando cuidador',
  'hook.delete-carer.description':
    'Estamos eliminando este cuidador de forma segura.',
  'hook.delete-carer.error-title': 'Error al eliminar',
  'hook.delete-carer.error-description':
    'No hemos podido eliminar al cuidador en este momento.',
  'hook.delete-carer.success-title': 'Cuidador eliminado',
  'hook.delete-carer.success-description':
    'El cuidador ahora está inactivo y oculto para la sincronización.',
  'hook.create-carer.title': 'Creando cuidador',
  'hook.create-carer.description':
    'Estamos creando este cuidador de forma segura.',
  'hook.create-carer.error-title': 'Error al crear',
  'hook.create-carer.error-description':
    'No hemos podido crear al cuidador en este momento.',
  'hook.create-carer.success-title': 'Cuidador creado',
  'hook.create-carer.success-description': 'El cuidador ahora está activo.',
  'hook.create-secondary-carer.title': 'Creando cuidador',
  'hook.create-secondary-carer.description':
    'Guardando el nuevo cuidador secundario.',
  'hook.create-secondary-carer.error-title': 'No se pudo crear el cuidador',
  'hook.create-secondary-carer.error-description':
    'Inténtalo de nuevo más tarde para añadir al cuidador secundario.',
  'hook.create-secondary-carer.success-title': 'Cuidador creado',
  'hook.create-secondary-carer.success-description':
    'El cuidador secundario está listo para recibir invitaciones.',
  'hook.sync-with-carer.title': 'Sincronizando datos',
  'hook.sync-with-carer.description': 'Importando registros desde el QR.',
  'hook.sync-with-carer.error-title': 'Error de sincronización',
  'hook.sync-with-carer.error-description':
    'No se pudieron sincronizar los registros. Inténtalo de nuevo.',
  'hook.sync-with-carer.success-title': 'Sincronización registrada',
  'hook.sync-with-carer.success-description':
    'El evento de sincronización se ha registrado correctamente.',
  'hook.generate-sync-qr.title': 'Generando QR de sincronización',
  'hook.generate-sync-qr.description':
    'Espera mientras generamos el bundle QR de sincronización.',
  'hook.generate-sync-qr.error-title': 'Error al generar',
  'hook.generate-sync-qr.error-description':
    'No se pudo generar el código QR de sincronización.',
  'hook.generate-sync-qr.success-title': 'QR generado',
  'hook.generate-sync-qr.success-description':
    'El QR de sincronización está listo para ser escaneado.',
  'hook.secondary-carer.generate-invitation-qr.title':
    'Generando QR de invitación',
  'hook.secondary-carer.generate-invitation-qr.description':
    'Por favor, espera mientras generamos el bundle QR de invitación.',
  'hook.secondary-carer.generate-invitation-qr.error-title': 'Error al generar',
  'hook.secondary-carer.generate-invitation-qr.error-description':
    'No se pudo generar el código QR de invitación.',
  'hook.secondary-carer.generate-invitation-qr.success-title': 'QR generado',
  'hook.secondary-carer.generate-invitation-qr.success-description':
    'El QR de invitación está listo para ser escaneado.',
  'hook.consume-sync-qr.title': 'Sincronizando registros',
  'hook.consume-sync-qr.description':
    'Procesando los registros del QR escaneado.',
  'hook.consume-sync-qr.error-title': 'Sincronización fallida',
  'hook.consume-sync-qr.error-description':
    'No se pudieron sincronizar los registros. Por favor, intenta escanear de nuevo.',
  'hook.consume-sync-qr.success-title': 'Sincronización completada',
  'hook.consume-sync-qr.success-description':
    'Los registros se han sincronizado correctamente.',
  'page.settings.synchronization.summary.title': 'Resumen de sincronización',
  'page.settings.synchronization.summary.desc':
    'Todos los fragmentos se han recuperado correctamente. Presiona el botón abajo para aplicar los cambios en tu base de datos.',
  'page.settings.synchronization.summary.stats.title':
    'Estadísticas (Provisional):',
  'page.settings.synchronization.summary.stats.chunks':
    '• Fragmentos procesados: {{count}}',
  'page.settings.synchronization.summary.stats.records':
    '• Registros detectados: {{count}}',
  'page.settings.synchronization.summary.stats.dates':
    '• Rango de fechas: {{startDate}} - {{endDate}}',
  'page.settings.synchronization.collection.progress':
    'Recogidos {{count}} de {{total}} fragmentos',
  'page.settings.synchronization.collection.start':
    'Escanea el primer código QR para empezar',
  'use-case.consume-record-synchronization-qr.success':
    'Registros sincronizados correctamente',
  'use-case.generate-record-synchronization-qr.success':
    'QR de sincronización de registros generado correctamente',
  'page.carer-detail.heading': 'Detalles del cuidador',
  'page.carer-detail.name-value': 'Nombre: <bold>{{name}}</bold>',
  'page.carer-detail.ttl':
    'TTL: <bold>{{ttl}}</bold> · Expira a las {{expiresAt}}',
  'page.carer-detail.analysis-button': 'Ver datos importados (pronto)',
  'page.carer-detail.sync-history.title': 'Historial de sincronización',
  'page.carer-detail.sync-history.empty':
    'No hay sincronizaciones registradas aún.',
  'page.carer-detail.history.record':
    '{{timestamp}} · {{status}} · {{records}} registros · {{details}}',
  'page.carer-detail.history.status.success': 'Éxito',
  'page.carer-detail.history.status.failure': 'Fallo',
  'page.app-settings.title': 'Ajustes de la App',
  'page.app-settings.subtitle': 'Personaliza tu experiencia en la aplicación',
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

  // Page: Logout confirmation
  'page.settings.logout-confirm.title': 'Esta acción es irreversible',
  'page.settings.logout-confirm.warning':
    'Esta acción eliminará todos los datos almacenados en este dispositivo para este perfil. No se puede deshacer.',
  'page.settings.logout-confirm.summary-title': 'Resumen de tu información',
  'page.settings.logout-confirm.time-registered': 'Tiempo registrado',
  'page.settings.logout-confirm.total-records': 'Registros totales',
  'page.settings.logout-confirm.cic': 'CIC',
  'page.settings.logout-confirm.stools': 'Deposiciones',
  'page.settings.logout-confirm.enemas': 'Enemas',
  'page.settings.logout-confirm.medication': 'Medicación',
  'page.settings.logout-confirm.confirm-question':
    '¿Estás seguro de que quieres borrarlo todo? Esto no se puede deshacer.',
  'page.settings.logout-confirm.delete-warning': 'Acción de borrado solicitada',
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
  'page.cic-register.discomfort.title': '¿Alguna molestia?',
  'page.cic-register.discomfort.description':
    'Indica si el niño/a experimentó molestias',
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
    'Registra volumen, color y molestias',
  'component.register-stool-button.label': 'Registrar Deposición',
  'component.register-stool-button.subtitle': 'Movimiento Intestinal',
  'component.register-stool-button.description':
    'Sigue la consistencia y la frecuencia',
  'component.register-medication-button.label': 'Registrar Medicación',
  'component.register-medication-button.subtitle': 'Administración de Medicina',
  'component.register-medication-button.description':
    'Registra el medicamento y la dosis',
  'component.filter-button.label': 'Filtros',
  'component.filter-button.all-types': 'Todos los tipos',
  'component.stat-card.cic-label': 'Cateterismos',
  'component.stat-card.stool-label': 'Deposiciones',
  'component.stat-card.medication-label': 'Medicación',
  'component.stat-card.today': 'Hoy',
  'page.report.debug-stats': 'Debug: estadísticas',
  'page.report.debug-trendItems': 'Debug: elementos de tendencia',

  // History detail ranges
  'page.history-detail.range.today': 'Hoy',
  'page.history-detail.range.7d': 'Últimos 7 días',
  'page.history-detail.range.30d': 'Últimos 30 días',
  'page.history-detail.range.90d': 'Últimos 90 días',

  // Accessibility
  'a11y.button.register-cic': 'Botón para registrar cateterismo',
  'a11y.button.register-stool': 'Botón para registrar deposición',
  'a11y.button.register-medication': 'Botón para registrar medicación',
  'a11y.button.open-filters': 'Abrir filtros',
  'a11y.button.view-all-history': 'Ver todo el historial',
  'a11y.button.child-profile': 'Ver perfil del niño/a',
  'a11y.button.manage-carers': 'Gestionar cuidadores',
  'a11y.button.app-settings': 'Ajustes de la app',
  'a11y.button.about': 'Acerca de',
  'a11y.button.logout': 'Cerrar sesión',
  'a11y.hint.opens-cic-form': 'Abre el formulario de registro de cateterismo',
  'a11y.hint.opens-stool-form': 'Abre el formulario de registro de deposición',
  'a11y.hint.opens-medication-form':
    'Abre el formulario de registro de medicación',
  'a11y.hint.opens-filter-modal': 'Abre el modal de filtros',
  'a11y.hint.opens-child-profile': 'Abre la pantalla de perfil del niño/a',
  'a11y.hint.opens-carer-management':
    'Abre la pantalla de gestión de cuidadores',
  'a11y.hint.opens-app-settings': 'Abre la pantalla de ajustes de la app',
  'a11y.hint.opens-about': 'Abre la pantalla acerca de',
  'a11y.hint.logout-action': 'Cierra tu sesión actual',

  // Modal Screen
  'modal.title': 'Esto es un modal',
  'modal.go-home': 'Ir a la pantalla de inicio',

  // Caregiver Setup
  'caregiver-setup.scan-qr.title': 'Escanear código QR',
  'page.caregiver-setup.scan-qr.camera-hint':
    'Mantén el QR dentro del marco para la recogida automática de fragmentos.',
  'page.caregiver-setup.scan-qr.camera-permission':
    'Permite el acceso a la cámara para escanear los bundles QR automáticamente.',
  'page.caregiver-setup.scan-qr.camera-request': 'Conceder acceso a la cámara',
  'page.caregiver-setup.scan-qr.instructions':
    'Escanea el QR de invitación o pega cada fragmento a continuación.',
  'page.caregiver-setup.scan-qr.input.placeholder':
    'Pega la carga útil JSON del fragmento',
  'page.caregiver-setup.scan-qr.add-chunk': 'Añadir fragmento',
  'page.caregiver-setup.scan-qr.reset': 'Reiniciar escáner',
  'page.caregiver-setup.scan-qr.status':
    'Escaneados {{count}} / {{total}} fragmentos',
  'page.caregiver-setup.scan-qr.chunk-item': 'Fragmento {{index}} de {{total}}',
  'page.caregiver-setup.scan-qr.error.invalid-chunk':
    'Fragmento inválido. Por favor, inténtalo de nuevo.',
  'caregiver-setup.confirm-link.title': 'Confirmar enlace',
  'page.caregiver-setup.confirm-link.subtitle':
    'Cuidador secundario enlazado correctamente.',
  'page.caregiver-setup.confirm-link.details':
    'El cuidador <bold>{{name}}</bold> ya puede acceder a los registros compartidos.',
  'page.caregiver-setup.confirm-link.go-home': 'Ir al panel de control',

  // Modals
  'modal.add-carer.title': 'Modal añadir cuidador (Generación QR)',
  'modal.filter-history.title': 'Modal filtrar historial',
  'modal.quick-record.title': 'Modal registro rápido',
  'modal.reminders.title': 'Modal recordatorios',
  'modal.switch-account.title': 'Modal cambiar cuenta',
  'modal.symptom-alert.title': 'Modal alerta de síntomas',

  // Summary
  'page.summary-detail.period.day': 'Día',
  'page.summary-detail.period.week': 'Semana',
  'page.summary-detail.period.month': 'Mes',
  'page.summary-detail.period.half-year': '6 meses',
  'page.summary-detail.period.year': 'Año',

  'hook.setup-parent.title': 'Configurando progenitor',
  'hook.setup-parent.description':
    'Por favor, espera mientras configuramos tu cuenta.',
  'hook.setup-parent.error-title': 'Falló la configuración',
  'hook.setup-parent.success-title': 'Configuración correcta',
  'hook.import-invite.description':
    'Validando el bundle antes de añadir al cuidador secundario.',
  'hook.import-invite.success-title': 'Invitación importada',
  'hook.import-invite.success-description':
    'Cuidador secundario añadido correctamente.',
  'hook.import-invite.error-title': 'Falló la importación',
  'hook.import-invite.error-description':
    'No se pudo importar la invitación. Inténtalo de nuevo.',
  'hook.get-list-active-module.title': 'Cargando módulos',
  'hook.get-list-active-module.description':
    'Por favor, espera mientras cargamos los módulos.',
  'hook.get-list-active-module.error-title': 'Error al cargar módulos',
  'hook.get-list-active-module.success-title': 'Módulos cargados correctamente',
  'hook.get-list-module-field.error-title': 'Error al cargar campos del módulo',
  'error.on-get-entity-by-id': 'Error al obtener la entidad por ID',

  'hook.get-record-trend.error': 'Error al obtener la tendencia del registro',

  'test.reset-db': 'Reiniciar base de datos para pruebas',
  'hook.create-record.error-title': 'Falló la creación del registro',
  'hook.create-record.success-title': 'Registro creado correctamente',
  'hook.add-demo-data.error-title': 'Falló la adición de datos de demo',
  'hook.add-demo-data.success-title': 'Datos de demo añadidos correctamente',
  'hook.add-demo-data.success-description':
    'Los datos de demo se han añadido correctamente',
  'hook.add-demo-data.error-description':
    'Ocurrió un error al añadir los datos de demo',
  'hook.get-record-field-distribution.error':
    'Error al obtener la distribución de campos',

  'use-case.generate-invitation-qr-for-secondary-carer.invalid-request':
    'Petición inválida para generar el QR de invitación',
  'use-case.generate-invitation-qr-for-secondary-carer.generation-failed':
    'Fallo al generar el QR de invitación',
  'use-case.create-record.carer-not-found-in-cache':
    'Cuidador no encontrado en la caché',
  'use-case.create-carer.invalid-request':
    'Petición inválida para crear cuidador',
  'use-case.delete-carer.invalid-request':
    'Petición inválida para eliminar cuidador',
  'use-case.create-secondary-carer.invalid-request':
    'Petición inválida para crear cuidador secundario',
  'use-case.secondary-carer-consume-invitation-qr.invalid-qr-data':
    'Datos QR proporcionados inválidos',
  'use-case.secondary-carer-consume-invitation-qr.carer-exists':
    'el cuidador ya existe',
  'use-case.sync-with-carer.invalid-request':
    'Petición inválida para sincronizar con el cuidador',
  'page.carer-detail.title': 'Detalle del cuidador',
  'page.carer-detail.subtitle':
    'Ver información del cuidador e historial de sincronización',

  // Secondary Carer Setup
  'secondary-carer-setup.carer-info.title': 'Sobre ti',
  'secondary-carer-setup.carer-info.description':
    'Información básica sobre el cuidador secundario.',
  'secondary-carer-setup.carer-info.name-label': 'Nombre:',
  'secondary-carer-setup.carer-info.name-placeholder': 'Tu nombre',
  'secondary-carer-setup.carer-info.relationship-label':
    'Relación con el niño:',
  'secondary-carer-setup.carer-info.relationship-placeholder':
    'Selecciona la relación',
  'secondary-carer-setup.carer-info.relationship.family':
    'Miembro de la familia',
  'secondary-carer-setup.carer-info.relationship.professional':
    'Profesional sanitario',
  'secondary-carer-setup.carer-info.relationship.other': 'Otro',
  'secondary-carer-setup.carer-info.notes-label':
    'Notas adicionales (opcional):',
  'secondary-carer-setup.carer-info.notes-placeholder':
    'Cualquier información adicional...',

  // Scan QR Step
  'secondary-carer-setup.scan-qr.title': 'Escanear QR de invitación',
  'secondary-carer-setup.scan-qr.description':
    'Escanea el código QR de tu invitación para continuar con la configuración.',
  'secondary-carer-setup.scan-qr.progress': 'Progreso: {{progress}}',
  'secondary-carer-setup.scan-qr.manual.title':
    'O introduce los datos del QR manualmente:',
  'secondary-carer-setup.scan-qr.manual.placeholder':
    'Pega los datos del fragmento QR aquí...',
  'secondary-carer-setup.scan-qr.manual.submit': 'Procesar fragmento',

  // QR Info Step
  'secondary-carer-setup.qr-info.title': 'Detalles de la invitación',
  'secondary-carer-setup.qr-info.description':
    'Revisa y confirma los detalles de la invitación.',
  'secondary-carer-setup.qr-info.invitation-details':
    'Detalles de la invitación',
  'secondary-carer-setup.qr-info.name': 'Nombre invitado',
  'secondary-carer-setup.qr-info.ttl': 'Tiempo de vida (TTL)',
  'secondary-carer-setup.qr-info.expires-at':
    'Expira a las: <bold>{{expiresAt}}</bold>',
  'secondary-carer-setup.qr-info.user-name':
    'Tu nombre: <bold>{{userName}}</bold>',
  'secondary-carer-setup.qr-info.form-title': 'Tu información',
  'secondary-carer-setup.modules.title': 'Módulos activos',
  'secondary-carer-setup.modules.description':
    'Revisa los módulos a los que tendrás acceso.',
  'secondary-carer-setup.modules.empty': 'No se han encontrado módulos activos.',
  'secondary-carer-setup.modules.note':
    'Podrás ver y contribuir en estos módulos de salud.',
  'secondary-carer-setup.summary.title': 'Revisa tu información',
  'secondary-carer-setup.summary.description':
    'Confirma que todo esté correcto antes de continuar',
  'secondary-carer-setup.summary.carer-name': 'Nombre',
  'secondary-carer-setup.summary.relationship': 'Relación',
  'secondary-carer-setup.summary.notes': 'Notas',
  'secondary-carer-setup.summary.modules-count': 'Módulos activos',
  'secondary-carer-setup.summary.terms': 'Acepto los términos y condiciones',
  'secondary-carer-setup.summary.confirmation-note':
    'Al continuar, aceptas compartir datos de salud de forma segura.',
  'page.caregiver-setup.scan-qr.permission.title':
    'Permiso de cámara necesario',
  'page.caregiver-setup.scan-qr.permission.description':
    'Por favor, permite el acceso a la cámara para escanear el código QR de invitación.',
  'page.caregiver-setup.scan-qr.permission.request':
    'Concede acceso a la cámara',
  'use-case.consume-record-synchronization-qr.invalid-bundle':
    'Paquete de sincronización inválido proporcionado',
}) satisfies Record<Ti18nKeys, string>;
