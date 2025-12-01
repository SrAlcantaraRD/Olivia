import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export const esES = {
  welcome: 'Bienvenido',
  next: 'Siguiente',
  parent: 'Progenitor',
  caregiver: 'Cuidador',
  finish: 'Finalizar',
  skip: 'Saltar',
  'start-onboarding': 'Comenzar',
  'add-register': 'Añadir registro',

  // Common
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
  'common.optional': 'Opcional',
  'common.required': 'Obligatorio',
  'common.view_all': 'Ver todo',

  // Tab navigation
  'tab.register': 'Registro',
  'tab.report': 'Reporte',
  'tab.settings': 'Configuración',

  // Page: Register Tab
  'page.register.title': 'Registro',
  'page.register.subtitle': 'Registra cateterismos, deposiciones y medicación',
  'page.register.quick_actions': 'Acciones rápidas',
  'page.register.recent_activity': 'Actividad reciente',
  'page.register.no_recent_activity': 'No hay actividad reciente',

  // Page: Report Tab
  'page.report.title': 'Reporte',
  'page.report.subtitle': 'Visualiza estadísticas y el historial',
  'page.report.filters': 'Filtros',
  'page.report.statistics': 'Estadísticas',
  'page.report.history': 'Historial',
  'page.report.no_history': 'No hay registros en el historial',

  // Page: History Detail
  'page.history_detail.title': 'Detalle del Historial',
  'page.history_detail.placeholder':
    'Contenido del historial detallado próximamente',

  // Page: Settings Tab
  'page.settings.title': 'Configuración',
  'page.settings.subtitle': 'Gestiona el perfil, cuidadores y ajustes',
  'page.settings.section_child': 'Niño/a',
  'page.settings.section_carers': 'Cuidadores',
  'page.settings.section_app': 'Aplicación',
  'page.settings.section_danger': 'Zona de peligro',
  'page.settings.child_profile': 'Perfil del niño/a',
  'page.settings.child_profile_desc': 'Datos personales y diagnóstico',
  'page.settings.manage_carers': 'Gestionar cuidadores',
  'page.settings.manage_carers_desc': 'Añade o elimina cuidadores',
  'page.settings.app_settings': 'Ajustes de la app',
  'page.settings.app_settings_desc': 'Tema, idioma y privacidad',
  'page.settings.about': 'Acerca de',
  'page.settings.about_desc': 'Versión e información legal',
  'page.settings.logout': 'Cerrar sesión',

  // Page: Settings Detail Screens
  'page.child_profile.title': 'Perfil del Niño/a',
  'page.child_profile.placeholder': 'Formulario de perfil próximamente',
  'page.carer_management.title': 'Gestión de Cuidadores',
  'page.carer_management.placeholder': 'Lista de cuidadores próximamente',
  'page.app_settings.title': 'Ajustes de la Aplicación',
  'page.app_settings.placeholder': 'Ajustes de la aplicación próximamente',

  // Page: CIC Registration Wizard - Volume
  'page.cic_register.volume.title': 'Volumen de orina',
  'page.cic_register.volume.description': 'Selecciona el volumen observado',
  'page.cic_register.volume.low': 'Bajo',
  'page.cic_register.volume.normal': 'Normal',
  'page.cic_register.volume.high': 'Alto',

  // Page: CIC Registration Wizard - Color
  'page.cic_register.color.title': 'Color de la orina',
  'page.cic_register.color.description': 'Selecciona el color observado',
  'page.cic_register.color.transparent': 'Transparente',
  'page.cic_register.color.light_yellow': 'Amarillo claro',
  'page.cic_register.color.dark_yellow': 'Amarillo oscuro',
  'page.cic_register.color.abnormal': 'Anómalo',

  // Page: CIC Registration Wizard - Turbidity
  'page.cic_register.turbidity.title': 'Turbidez',
  'page.cic_register.turbidity.description': 'Selecciona la turbidez observada',
  'page.cic_register.turbidity.clear': 'Clara',
  'page.cic_register.turbidity.slight': 'Leve',
  'page.cic_register.turbidity.high': 'Alta',

  // Page: CIC Registration Wizard - Discomfort
  'page.cic_register.discomfort.title': '¿Hubo molestias?',
  'page.cic_register.discomfort.description':
    'Indica si el niño/a presentó molestias',
  'page.cic_register.discomfort.none': 'No',
  'page.cic_register.discomfort.slight': 'Leve',
  'page.cic_register.discomfort.pain': 'Dolor',
  'page.cic_register.discomfort.note_label': 'Describe el dolor (opcional)',
  'page.cic_register.discomfort.note_placeholder':
    'Ej: Dolor al inicio del cateterismo',

  // Page: CIC Registration Wizard - Summary
  'page.cic_register.summary.title': 'Resumen del registro',
  'page.cic_register.summary.description':
    'Confirma que todo es correcto antes de guardar',
  'page.cic_register.summary.volume_label': 'Volumen',
  'page.cic_register.summary.color_label': 'Color',
  'page.cic_register.summary.turbidity_label': 'Turbidez',
  'page.cic_register.summary.discomfort_label': 'Molestias',
  'page.cic_register.summary.notes_label': 'Notas adicionales (opcional)',
  'page.cic_register.summary.notes_placeholder':
    'Añade notas adicionales si lo deseas',
  'page.cic_register.summary.save_button': 'Guardar registro',
  'page.cic_register.summary.success': 'Registro guardado correctamente',
  'page.cic_register.summary.error': 'Error al guardar el registro',

  // Components
  'component.register_cic_button.label': 'Registrar Cateterismo (CIC)',
  'component.register_cic_button.subtitle': 'Cateterismo Intermitente Limpio',
  'component.register_cic_button.description':
    'Registra volumen, color e incomodidad',
  'component.register_stool_button.label': 'Registrar Deposición',
  'component.register_stool_button.subtitle': 'Movimiento Intestinal',
  'component.register_stool_button.description':
    'Seguimiento de consistencia y frecuencia',
  'component.register_medication_button.label': 'Registrar Medicación',
  'component.register_medication_button.subtitle':
    'Administración de Medicinas',
  'component.register_medication_button.description':
    'Registra medicación y dosis',
  'component.filter_button.label': 'Filtros',
  'component.filter_button.all_types': 'Todos los tipos',
  'component.stat_card.cic_label': 'Cateterismos',
  'component.stat_card.stool_label': 'Deposiciones',
  'component.stat_card.medication_label': 'Medicación',
  'component.stat_card.today': 'Hoy',

  // Accessibility
  'a11y.button.register_cic': 'Botón para registrar cateterismo',
  'a11y.button.register_stool': 'Botón para registrar deposición',
  'a11y.button.register_medication': 'Botón para registrar medicación',
  'a11y.button.open_filters': 'Abrir filtros',
  'a11y.button.view_all_history': 'Ver todo el historial',
  'a11y.button.child_profile': 'Ver perfil del niño',
  'a11y.button.manage_carers': 'Gestionar cuidadores',
  'a11y.button.app_settings': 'Ajustes de la aplicación',
  'a11y.button.about': 'Acerca de',
  'a11y.button.logout': 'Cerrar sesión',
  'a11y.hint.opens_cic_form': 'Abre el formulario de registro de cateterismo',
  'a11y.hint.opens_stool_form': 'Abre el formulario de registro de deposición',
  'a11y.hint.opens_medication_form':
    'Abre el formulario de registro de medicación',
  'a11y.hint.opens_filter_modal': 'Abre la modal de filtros',
  'a11y.hint.opens_child_profile': 'Abre la pantalla de perfil del niño',
  'a11y.hint.opens_carer_management':
    'Abre la pantalla de gestión de cuidadores',
  'a11y.hint.opens_app_settings':
    'Abre la pantalla de ajustes de la aplicación',
  'a11y.hint.opens_about': 'Abre la pantalla acerca de',
  'a11y.hint.logout_action': 'Cierra tu sesión actual',
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

  // Onboarding (legacy keys - keeping for backward compatibility)
  'onboarding-slide1-title': 'Te ayudamos a cuidar con tranquilidad.',
  'onboarding-slide1-description':
    'Registra cateterismos y rutinas de forma rápida, clara y sin conexión.',
  'onboarding-slide2-title': 'Rápido. Guiado. Pensado para tu día a día.',
  'onboarding-slide2-bullet1': 'Registro en segundos',
  'onboarding-slide2-bullet2': 'Un paso cada vez',
  'onboarding-slide2-bullet3': 'Perfecto para rutinas con prisas',
  'onboarding-slide3-title': 'Tus datos, bajo tu control.',
  'onboarding-slide3-description':
    'Todo queda en tu móvil. Sin nube. Sin cuentas.\nTú decides con quién compartir.',

  // Actions (legacy keys - keeping for backward compatibility)
  'actions.save': 'Guardar',
  'actions.cancel': 'Cancelar',
} satisfies Ti18nKeys;
