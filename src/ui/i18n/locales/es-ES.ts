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
  'hook.get-record-statistics.error':
    'Error al cargar estadísticas de registros',
  'common.optional': 'Opcional',
  'common.required': 'Obligatorio',
  'common.view-all': 'Ver todo',

  // Tab navigation
  'tab.register': 'Registro',
  'tab.report': 'Reporte',
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
  'page.settings.logout': 'Cerrar sesión',

  // Page: Settings Detail Screens
  'page.child-profile.title': 'Perfil del Niño/a',
  'page.child-profile.placeholder': 'Formulario de perfil próximamente',
  'page.carer-management.title': 'Gestión de Cuidadores',
  'page.carer-management.placeholder': 'Lista de cuidadores próximamente',
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
  'caregiver-setup.confirm-link.title': 'Confirmar enlace',
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

  'hook.setup-parent.title': 'Configurando progenitor',
  'hook.setup-parent.description':
    'Por favor espera mientras configuramos tu cuenta.',
  'hook.setup-parent.error-title': 'Configuración Fallida',
  'hook.setup-parent.success-title': 'Configuración Exitosa',
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
  'hook.get-record-field-distribution.error':
    'Error obteniendo distribución del campo',
  'page.settings.section-configuration': 'Configuración',
} satisfies Record<Ti18nKeys, string>);
