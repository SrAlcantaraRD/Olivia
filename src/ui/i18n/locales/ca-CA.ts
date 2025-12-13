import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export const caCA = Object.freeze({
  // Legacy keys (keeping for backward compatibility)
  welcome: 'Benvingut',
  next: 'Següent',
  parent: 'Progenitor',
  caregiver: 'Cuidador',
  finish: 'Finalitzar',
  skip: 'Saltar',
  continue: 'Continuar',
  'start-onboarding': 'Començar',
  'add-register': 'Afegir registre',

  'page.app_settings.section_theme': 'Tema',
  'page.app_settings.section_language': 'Idioma',
  'page.app_settings.language.english': 'Anglès',
  'page.app_settings.language.spanish': 'Espanyol',
  'page.app_settings.language.catalan': 'Català',
  'page.app_settings.action.switch_to_dark': 'Canviar a Mode Fosc',
  'page.app_settings.action.switch_to_light': 'Canviar a Mode Clar',

  // Splash Screen
  'splash-screen.app-name': 'Oliva',
  'splash-screen.tagline': 'Cuidar. Registrar. Respirar.',
  'splash-screen.privacy-notice':
    'Les teves dades es guarden només al teu telèfon',
  // Onboarding
  'onboarding-screen.slider.care-with-peace.title':
    "T'ajudem a cuidar amb tranquil·litat.",
  'onboarding-screen.slider.care-with-peace.description':
    'Registra cateterismes i rutines de forma ràpida, clara i sense connexió.',
  'onboarding-screen.slider.slogan.title':
    'Ràpid. Guiat. Pensat per al teu dia a dia.',
  'onboarding-screen.slider.slogan.bullet.record-in-seconds':
    'Registre en segons',
  'onboarding-screen.slider.slogan.bullet.one-step-at-a-time':
    'Un pas cada vegada',
  'onboarding-screen.slider.slogan.bullet.perfect-for-busy-routines':
    'Perfecte per a rutines amb presses',
  'onboarding-screen.slider.data-control.title':
    'Les teves dades, sota el teu control.',
  'onboarding-screen.slider.data-control.description':
    'Tot queda al teu telèfon. Sense núvol. Sense comptes.\nTu decideixes amb qui compartir.',
  // Role Selection Screen
  'role-selection-screen.title': 'Com vols començar?',
  'role-selection-screen.description': "Tria el teu rol per configurar l'app.",
  'role-selection-screen.parent.title': 'Progenitor / Tutor',
  'role-selection-screen.parent.subtitle': 'Cuidador principal',
  'role-selection-screen.parent.description':
    'Registra i gestiona rutines i cateterismes per als teus fills.',
  'role-selection-screen.caregiver.title': 'Cuidador / Professional',
  'role-selection-screen.caregiver.subtitle': 'Suport o professional sanitari',
  'role-selection-screen.caregiver.description':
    'Connecta amb famílies i registra intervencions.',
  // Parent Setup
  'parent-setup.parent-info.title': 'Sobre tu',
  'parent-setup.parent-info.description':
    'Dades bàsiques del cuidador principal.',
  'parent-setup.parent-info.name-label': 'Nom:',
  'parent-setup.parent-info.name-placeholder': 'El teu nom',
  'parent-setup.parent-info.relationship-label': 'Relació:',
  'parent-setup.parent-info.parent': 'Pare / Mare',
  'parent-setup.parent-info.guardian': 'Tutor',
  'parent-setup.child-info.title': 'Sobre el nen',
  'parent-setup.child-info.description':
    'Dades bàsiques del menor per identificar-lo.',
  'parent-setup.child-info.name-label': 'Nom:',
  'parent-setup.child-info.name-placeholder': 'Nom del nen/na',
  'parent-setup.child-info.birth-date-label': 'Data de naixement:',
  'parent-setup.child-info.birth-date-placeholder': 'DD / MM / AAAA',
  'parent-setup.child-info.diagnosis-label': 'Diagnòstic:',
  'parent-setup.child-info.diagnosis-placeholder': 'Diagnòstic mèdic',
  'parent-setup.child-info.diagnosis-hint':
    'Opcional: Pots afegir-ho més tard si ho prefereixes.',
  'parent-setup.modules.title': 'Quins mòduls necessites?',
  'parent-setup.modules.description':
    'Activa els mòduls que utilitzaràs. Pots modificar-los després al perfil del menor.',
  'parent-setup.modules.catheterization.title': 'Cateterismes',
  'parent-setup.modules.catheterization.description':
    'Gestió de cateterismes i registres CIC.',
  'parent-setup.modules.bowel-movements.title': 'Deposicions',
  'parent-setup.modules.bowel-movements.description':
    'Registre de deposicions i seguiment.',
  'parent-setup.modules.enemas.title': 'Enemes',
  'parent-setup.modules.enemas.description':
    'Opcional, segons necessitats clíniques.',
  'parent-setup.modules.urine.title': 'Orina',
  'parent-setup.modules.urine.description':
    "Seguiment de volum i característiques de l'orina.",
  'parent-setup.modules.medication.title': 'Medicació',
  'parent-setup.modules.medication.description':
    "Registre d'administració de medicaments.",
  'parent-setup.modules.unknown.title': 'Mòdul desconegut',
  'parent-setup.modules.unknown.description': 'Descripció del mòdul desconegut',
  'parent-setup.summary.title': 'Revisa la teva informació',
  'parent-setup.summary.description':
    'Confirma que tot és correcte abans de continuar',
  'parent-setup.summary.parent-section': 'Informació del Tutor',
  'parent-setup.summary.parent-name': 'Nom: <bold>{{value}}</bold>',
  'parent-setup.summary.parent-relationship': 'Relació: <bold>{{value}}</bold>',
  'parent-setup.summary.child-section': 'Informació del Menor',
  'parent-setup.summary.child-name': 'Nom: <bold>{{value}}</bold>',
  'parent-setup.summary.child-birth-date':
    'Data de naixement: <bold>{{value}}</bold>',
  'parent-setup.summary.child-diagnosis': 'Diagnòstic',
  'parent-setup.summary.modules-section': 'Mòduls Activats',
  'parent-setup.summary.no-modules': "No s'han seleccionat mòduls",

  // Common
  'common.raw-value': '{{value}}',
  'common.back': 'Enrere',
  'common.next': 'Següent',
  'common.cancel': 'Cancel·la',
  'common.save': 'Desa',
  'common.edit': 'Edita',
  'common.delete': 'Elimina',
  'common.confirm': 'Confirma',
  'common.loading': 'Carregant...',
  'common.error': 'Error',
  'common.success': 'Èxit',
  'hook.get-record-statistics.error':
    'Error carregant estadístiques de registres',
  'common.optional': 'Opcional',
  'common.required': 'Obligatori',
  'common.view_all': 'Veure tot',
  'common.number': '{{value}}',

  // Tab navigation
  'tab.register': 'Registre',
  'tab.report': 'Informe',
  'tab.settings': 'Configuració',

  // Page: Register Tab
  'page.register.title': 'Registre',
  'page.register.subtitle': 'Registra cateterismes, deposicions i medicació',
  'page.register.quick_actions': 'Accions ràpides',
  'page.register.recent_activity': 'Activitat recent',
  'page.register.no_recent_activity': 'No hi ha activitat recent',

  // Page: Report Tab
  'page.report.title': 'Informe',
  'page.report.subtitle': 'Visualitza estadístiques i història',
  'page.report.filters': 'Filtres',
  'page.report.statistics': 'Estadístiques',
  'page.report.history': 'Història',
  'page.report.no_history': 'No hi ha registres a la història',

  // Page: History Detail
  'page.history_detail.title': 'Detall de la Història',
  'page.history_detail.placeholder':
    'Contingut detallat de la història pròximament',
  'page.history_detail.select_field': 'Selecciona un camp',
  'page.history_detail.no_fields':
    'No hi ha camps disponibles per a aquest mòdul',
  'page.history_detail.no_data':
    'No hi ha dades per a aquest camp en el rang seleccionat',

  // Page: Settings Tab
  'page.settings.title': 'Configuració',
  'page.settings.subtitle': "Gestiona perfil, cuidadors i ajustos de l'app",
  'page.settings.section_child': 'Nen/a',
  'page.settings.section_carers': 'Cuidadors',
  'page.settings.section_app': 'Aplicació',
  'page.settings.section_danger': 'Zona de perill',
  'page.settings.child_profile': 'Perfil del nen/a',
  'page.settings.child_profile_desc': 'Dades personals i diagnòstic',
  'page.settings.manage_carers': 'Gestiona cuidadors',
  'page.settings.manage_carers_desc': 'Afegeix o elimina cuidadors',
  'page.settings.app_settings': "Ajustos de l'app",
  'page.settings.app_settings_desc': 'Tema, idioma i privacitat',
  'page.settings.about': 'Sobre',
  'page.settings.about_desc': 'Versió i informació legal',
  'page.settings.logout': 'Tanca sessió',

  // Page: Settings Detail Screens
  'page.child_profile.title': 'Perfil del Nen/a',
  'page.child_profile.placeholder': 'Formulari de perfil pròximament',
  'page.carer_management.title': 'Gestió de Cuidadors',
  'page.carer_management.placeholder': 'Llista de cuidadors pròximament',
  'page.app_settings.title': "Configuració de l'App",
  'page.app_settings.placeholder': "Personalitza la teva experiència a l'app",

  // Page: Logout confirmation
  'page.settings.logout_confirm.title': 'Aquesta acció és irreversible',
  'page.settings.logout_confirm.warning':
    'Aquesta acció eliminarà totes les dades emmagatzemades en aquest dispositiu per a aquest perfil. No es pot desfer.',
  'page.settings.logout_confirm.summary_title': 'Resum de la teva informació',
  'page.settings.logout_confirm.time_registered': 'Temps registrat',
  'page.settings.logout_confirm.total_records': 'Registres totals',
  'page.settings.logout_confirm.cic': 'CIC',
  'page.settings.logout_confirm.stools': 'Deposicions',
  'page.settings.logout_confirm.enemas': 'Enemes',
  'page.settings.logout_confirm.medication': 'Medicació',
  'page.settings.logout_confirm.confirm_question':
    'Estàs segur que vols eliminar tot? Això no es pot desfer.',
  'page.settings.logout_confirm.delete_warning':
    "Acció d'eliminació sol·licitada",
  'page.settings.logout_confirm.time_registered_value': '{{count}} dies',
  'page.settings.logout_confirm.total_records_value': '{{count}}',

  // Page: CIC Registration Wizard - Volume
  'page.cic_register.volume.title': "Volum d'orina",
  'page.cic_register.volume.description': 'Selecciona el volum observat',
  'page.cic_register.volume.low': 'Baix',
  'page.cic_register.volume.normal': 'Normal',
  'page.cic_register.volume.high': 'Alt',

  // Page: CIC Registration Wizard - Color
  'page.cic_register.color.title': "Color de l'orina",
  'page.cic_register.color.description': 'Selecciona el color observat',
  'page.cic_register.color.transparent': 'Transparent',
  'page.cic_register.color.light_yellow': 'Groc clar',
  'page.cic_register.color.dark_yellow': 'Groc fosc',
  'page.cic_register.color.abnormal': 'Anòmal',

  // Page: CIC Registration Wizard - Turbidity
  'page.cic_register.turbidity.title': 'Turbidesa',
  'page.cic_register.turbidity.description':
    'Selecciona la turbidesa observada',
  'page.cic_register.turbidity.clear': 'Clara',
  'page.cic_register.turbidity.slight': 'Lleu',
  'page.cic_register.turbidity.high': 'Alta',

  // Page: CIC Registration Wizard - Discomfort
  'page.cic_register.discomfort.title': 'Hi ha hagut molèsties?',
  'page.cic_register.discomfort.description':
    'Indica si el nen/na ha presentat molèsties',
  'page.cic_register.discomfort.none': 'No',
  'page.cic_register.discomfort.slight': 'Lleu',
  'page.cic_register.discomfort.pain': 'Dolor',
  'page.cic_register.discomfort.note_label': 'Descriu el dolor (opcional)',
  'page.cic_register.discomfort.note_placeholder':
    "P. ex.: Dolor a l'inici del cateterisme",

  // Page: CIC Registration Wizard - Summary
  'page.cic_register.summary.title': 'Resum del registre',
  'page.cic_register.summary.description':
    'Confirma que tot és correcte abans de desar',
  'page.cic_register.summary.volume_label': 'Volum',
  'page.cic_register.summary.color_label': 'Color',
  'page.cic_register.summary.turbidity_label': 'Turbidesa',
  'page.cic_register.summary.discomfort_label': 'Molèsties',
  'page.cic_register.summary.notes_label': 'Notes addicionals (opcional)',
  'page.cic_register.summary.notes_placeholder':
    'Afegeix notes addicionals si ho desitges',
  'page.cic_register.summary.save_button': 'Desa registre',
  'page.cic_register.summary.success': 'Registre desat correctament',
  'page.cic_register.summary.error': 'Error desant el registre',

  // Components
  'component.register_cic_button.label': 'Registrar Cateterisme (CIC)',
  'component.register_cic_button.subtitle': 'Cateterisme Intermitent Net',
  'component.register_cic_button.description':
    'Registra volum, color i incomoditat',
  'component.register_stool_button.label': 'Registrar Deposició',
  'component.register_stool_button.subtitle': 'Moviment Intestinal',
  'component.register_stool_button.description':
    'Seguiment de consistència i freqüència',
  'component.register_medication_button.label': 'Registrar Medicació',
  'component.register_medication_button.subtitle': 'Administració de Medicines',
  'component.register_medication_button.description':
    'Registra medicació i dosi',
  'component.filter_button.label': 'Filtres',
  'component.filter_button.all_types': 'Tots els tipus',
  'component.stat_card.cic_label': 'Cateterismes',
  'component.stat_card.stool_label': 'Deposicions',
  'component.stat_card.medication_label': 'Medicació',
  'component.stat_card.today': 'Avui',
  'page.report.debug_stats': 'Depurar: estadístiques',
  'page.report.debug_trendItems': 'Depurar: elements de tendència',

  // History detail ranges
  'page.history_detail.range.today': 'Avui',
  'page.history_detail.range.7d': 'Últims 7 dies',
  'page.history_detail.range.30d': 'Últims 30 dies',
  'page.history_detail.range.90d': 'Últims 90 dies',

  // Accessibility
  'a11y.button.register_cic': 'Botó per registrar cateterisme',
  'a11y.button.register_stool': 'Botó per registrar deposició',
  'a11y.button.register_medication': 'Botó per registrar medicació',
  'a11y.button.open_filters': 'Obrir filtres',
  'a11y.button.view_all_history': 'Veure tota la història',
  'a11y.button.child_profile': 'Veure perfil del nen',
  'a11y.button.manage_carers': 'Gestionar cuidadors',
  'a11y.button.app_settings': "Ajustos de l'aplicació",
  'a11y.button.about': 'Sobre',
  'a11y.button.logout': 'Tanca sessió',
  'a11y.hint.opens_cic_form': 'Obre el formulari de registre de cateterisme',
  'a11y.hint.opens_stool_form': 'Obre el formulari de registre de deposició',
  'a11y.hint.opens_medication_form':
    'Obre el formulari de registre de medicació',
  'a11y.hint.opens_filter_modal': 'Obre la modal de filtres',
  'a11y.hint.opens_child_profile': 'Obre la pantalla de perfil del nen',
  'a11y.hint.opens_carer_management': 'Obre la pantalla de gestió de cuidadors',
  'a11y.hint.opens_app_settings': "Obre la pantalla d'ajustos de l'aplicació",
  'a11y.hint.opens_about': 'Obre la pantalla sobre',
  'a11y.hint.logout_action': 'Tanca la teva sessió actual',
  // Modal Screen
  'modal.title': 'Això és un modal',
  'modal.go-home': 'Ves a la pantalla principal',
  // Caregiver Setup
  'caregiver-setup.scan-qr.title': 'Escanejar Codi QR',
  'caregiver-setup.confirm-link.title': 'Confirmar Enllaç',
  // Modals
  'modal.add-carer.title': 'Afegir Cuidador (Generar QR)',
  'modal.filter-history.title': 'Filtrar Història',
  'modal.quick-record.title': 'Registre Ràpid',
  'modal.reminders.title': 'Recordatoris',
  'modal.switch-account.title': 'Canviar de Compte',
  'modal.symptom-alert.title': 'Alerta de Símptomes',

  'hook.setup-parent.title': 'Configurant progenitor',
  'hook.setup-parent.description':
    'Si us plau espera mentre configurem el teu compte.',
  'hook.setup-parent.error-title': 'Configuració Fallida',
  'hook.setup-parent.success-title': 'Configuració Exitosa',
  'hook.get-list-active-module.title': 'Carregant Mòduls',
  'hook.get-list-active-module.description':
    'Si us plau espera mentre carreguem mòduls.',
  'hook.get-list-active-module.error-title': 'Error Carregant Mòduls',
  'hook.get-list-active-module.success-title': 'Mòduls Carregats Correctament',
  'hook.get-list-module-field.error-title': 'Error Carregant Camps del Mòdul',
  'error.on-get-entity-by-id': 'Error Obtenint Entitat per ID',

  'hook.get-record-trend.error': 'Error obtenint tendència de registres',

  'test.reset-db': 'Restablir Base de Dades per a Proves',
  'hook.create-record.error-title': 'Error en Crear Registre',
  'hook.create-record.success-title': 'Registre Creat Exitosament',
  'hook.get-record-field-distribution.error':
    'Error obtenint distribució del camp',
} satisfies Record<Ti18nKeys, string>);
