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

  'page.app-settings.section-theme': 'Tema',
  'page.app-settings.section-language': 'Idioma',
  'page.app-settings.language.english': 'Anglès',
  'page.app-settings.language.spanish': 'Espanyol',
  'page.app-settings.language.catalan': 'Català',
  'page.app-settings.action.switch-to-dark': 'Canviar a Mode Fosc',
  'page.app-settings.action.switch-to-light': 'Canviar a Mode Clar',

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
  'error.no-carer-found': "No s'ha trobat cuidador",
  'hook.get-record-statistics.error':
    'Error carregant estadístiques de registres',
  'common.optional': 'Opcional',
  'common.required': 'Obligatori',
  'common.view-all': 'Veure tot',
  'common.number': '{{value}}',

  // Tab navigation
  'tab.register': 'Registre',
  'tab.report': 'Informe',
  'tab.summary': 'Resum',
  'tab.settings': 'Configuració',

  // Page: Register Tab
  'page.register.title': 'Registre',
  'page.register.subtitle': 'Registra cateterismes, deposicions i medicació',
  'page.register.quick-actions': 'Accions ràpides',
  'page.register.recent-activity': 'Activitat recent',
  'page.register.no-recent-activity': 'No hi ha activitat recent',

  // Page: Report Tab
  'page.report.title': 'Informe',
  'page.report.subtitle': 'Visualitza estadístiques i història',
  'page.report.filters': 'Filtres',
  'page.report.statistics': 'Estadístiques',
  'page.report.history': 'Història',
  'page.report.no-history': 'No hi ha registres a la història',

  // Page: Summary Tab
  'page.summary.title': 'Resum',
  'page.summary.subtitle': 'Vista ràpida de dades de salut',
  'page.summary.section.pinned': 'Dades fixades',
  'page.summary.section.modules': 'Mòduls',
  'page.summary.pins-empty': 'Fixa elements per veure-los aquí',
  'page.summary.modules-empty': 'No hi ha mòduls per mostrar',
  'page.summary.today-count': 'Avui: {{value}}',
  'page.summary.metric-label.today': 'Avui',
  'page.summary.metric-label.steps': 'passos',
  'page.summary.all-data': 'Mostrar totes les dades de salut',
  'page.summary.trends': 'Tendències',
  'page.summary.highlights': 'Dades importants',

  // Page: Summary All Data
  'page.summary-all-data.title': 'Totes les dades de salut',
  'page.summary-all-data.subtitle': 'Explora mòduls i detalls',
  'page.summary-all-data.heading': 'Mòduls actius',
  'page.summary-all-data.empty': 'Encara no hi ha mòduls actius',

  // Page: Summary Trends
  'page.summary-trends.title': 'Tendències',
  'page.summary-trends.subtitle': 'Patrons i canvis detectats',
  'page.summary-trends.heading': 'Tendències recents',
  'page.summary-trends.empty': 'No hi ha tendències disponibles',

  // Page: Summary Highlights
  'page.summary-highlights.title': 'Dades importants',
  'page.summary-highlights.subtitle': 'Insights rellevants',
  'page.summary-highlights.heading': 'Dades importants',
  'page.summary-highlights.empty': 'No hi ha dades importants encara',

  // Page: Summary Detail
  'page.summary-detail.title': 'Detall del resum',
  'page.summary-detail.subtitle': 'Vista detallada',
  'page.summary-detail.heading': 'Informació detallada',
  'page.summary-detail.average-label': 'Mitjana',
  'page.summary-detail.range-placeholder': '7-13 des 2025',
  'page.summary-detail.trend': 'Tendència',
  'page.summary-detail.trend-empty': 'No disponible',
  'page.summary-detail.highlights': 'Dades importants',
  'page.summary-detail.fields': 'Camps',
  'page.summary-detail.fields-empty': 'No hi ha camps disponibles',
  'page.summary-detail.empty': 'No hi ha dades per a aquest període',
  'page.summary-detail.actions': 'Accions',
  'page.summary-detail.pin': 'Fixar al Resum',
  'page.summary-detail.unpin': 'Treure del Resum',
  'page.summary-detail.back-to-module': 'Tornar al mòdul',
  'page.summary-detail.back-to-summary': 'Tornar al Resum',

  // Summary Trends (fake data)
  'summary.trend.cic.up.title': "CIC a l'alça les darreres setmanes",
  'summary.trend.cic.up.description': 'El teu recompte de CIC ha pujat.',
  'summary.trend.stool.stable.title': 'Patró de deposicions estable',
  'summary.trend.stool.stable.description':
    'La freqüència de deposicions es manté estable.',

  // Summary Highlights (fake data)
  'summary.highlight.cic.high.title': 'CIC per sobre de l’habitual',
  'summary.highlight.cic.high.description':
    'La mitjana de CIC està per sobre del rang habitual.',
  'summary.highlight.urine.up.title': "Volum d'orina en augment",
  'summary.highlight.urine.up.description':
    "El volum diari d'orina mostra una pujada.",

  // Summary Detail placeholders
  'summary.detail.comparison.default': 'Comparat amb la teva mitjana',
  'summary.detail.projection.default': 'Projecció no disponible encara',

  // Page: History Detail
  'page.history-detail.title': 'Detall de la Història',
  'page.history-detail.subtitle': 'Vista detallada dels teus registres',
  'page.history-detail.placeholder':
    'Contingut detallat de la història pròximament',
  'page.history-detail.select-field': 'Selecciona un camp',
  'page.history-detail.no-fields':
    'No hi ha camps disponibles per a aquest mòdul',
  'page.history-detail.no-data':
    'No hi ha dades per a aquest camp en el rang seleccionat',

  // Page: Settings Tab
  'page.settings.title': 'Configuració',
  'page.settings.subtitle': "Gestiona perfil, cuidadors i ajustos de l'app",
  'page.settings.section-child': 'Nen/a',
  'page.settings.section-carers': 'Cuidadors',
  'page.settings.section-app': 'Aplicació',
  'page.settings.section-danger': 'Zona de perill',
  'page.settings.child-profile': 'Perfil del nen/a',
  'page.settings.child-profile-desc': 'Dades personals i diagnòstic',
  'page.settings.manage-carers': 'Gestiona cuidadors',
  'page.settings.manage-carers-desc': 'Afegeix o elimina cuidadors',
  'page.settings.app-settings': "Ajustos de l'app",
  'page.settings.app-settings-desc': 'Tema, idioma i privacitat',
  'page.settings.about': 'Sobre',
  'page.settings.about-desc': 'Versió i informació legal',
  'page.settings.add-demo-data': 'Afegeix Dades de Demo',
  'page.settings.add-demo-data-desc': 'Afegeix registres de mostra per proves',
  'page.settings.logout': 'Tanca sessió',

  // Page: Settings Detail Screens
  'page.child-profile.title': 'Perfil del Nen/a',
  'page.child-profile.placeholder': 'Formulari de perfil pròximament',
  'page.carer-management.title': 'Gestió de Cuidadors',
  'page.carer-management.placeholder': 'Llista de cuidadors pròximament',
  'page.app-settings.title': "Configuració de l'App",
  'page.app-settings.subtitle': "Personalitza la teva experiència a l'app",

  // About screen
  'page.about.title': 'Sobre',
  'page.about.placeholder': 'Versió i informació legal',

  // Page: Logout confirmation
  'page.settings.logout-confirm.title': 'Aquesta acció és irreversible',
  'page.settings.logout-confirm.warning':
    'Aquesta acció eliminarà totes les dades emmagatzemades en aquest dispositiu per a aquest perfil. No es pot desfer.',
  'page.settings.logout-confirm.summary-title': 'Resum de la teva informació',
  'page.settings.logout-confirm.time-registered': 'Temps registrat',
  'page.settings.logout-confirm.total-records': 'Registres totals',
  'page.settings.logout-confirm.cic': 'CIC',
  'page.settings.logout-confirm.stools': 'Deposicions',
  'page.settings.logout-confirm.enemas': 'Enemes',
  'page.settings.logout-confirm.medication': 'Medicació',
  'page.settings.logout-confirm.confirm-question':
    'Estàs segur que vols eliminar tot? Això no es pot desfer.',
  'page.settings.logout-confirm.delete-warning':
    "Acció d'eliminació sol·licitada",
  'page.settings.logout-confirm.time-registered-value': '{{count}} dies',
  'page.settings.logout-confirm.total-records-value': '{{count}}',

  // Page: CIC Registration Wizard - Volume
  'page.cic-register.volume.title': "Volum d'orina",
  'page.cic-register.volume.description': 'Selecciona el volum observat',
  'page.cic-register.volume.low': 'Baix',
  'page.cic-register.volume.normal': 'Normal',
  'page.cic-register.volume.high': 'Alt',

  // Page: CIC Registration Wizard - Color
  'page.cic-register.color.title': "Color de l'orina",
  'page.cic-register.color.description': 'Selecciona el color observat',
  'page.cic-register.color.transparent': 'Transparent',
  'page.cic-register.color.light-yellow': 'Groc clar',
  'page.cic-register.color.dark-yellow': 'Groc fosc',
  'page.cic-register.color.abnormal': 'Anòmal',

  // Page: CIC Registration Wizard - Turbidity
  'page.cic-register.turbidity.title': 'Turbidesa',
  'page.cic-register.turbidity.description':
    'Selecciona la turbidesa observada',
  'page.cic-register.turbidity.clear': 'Clara',
  'page.cic-register.turbidity.slight': 'Lleu',
  'page.cic-register.turbidity.high': 'Alta',

  // Page: CIC Registration Wizard - Discomfort
  'page.cic-register.discomfort.title': 'Hi ha hagut molèsties?',
  'page.cic-register.discomfort.description':
    'Indica si el nen/na ha presentat molèsties',
  'page.cic-register.discomfort.none': 'No',
  'page.cic-register.discomfort.slight': 'Lleu',
  'page.cic-register.discomfort.pain': 'Dolor',
  'page.cic-register.discomfort.note-label': 'Descriu el dolor (opcional)',
  'page.cic-register.discomfort.note-placeholder':
    "P. ex.: Dolor a l'inici del cateterisme",

  // Page: CIC Registration Wizard - Summary
  'page.cic-register.summary.title': 'Resum del registre',
  'page.cic-register.summary.description':
    'Confirma que tot és correcte abans de desar',
  'page.cic-register.summary.volume-label': 'Volum',
  'page.cic-register.summary.color-label': 'Color',
  'page.cic-register.summary.turbidity-label': 'Turbidesa',
  'page.cic-register.summary.discomfort-label': 'Molèsties',
  'page.cic-register.summary.notes-label': 'Notes addicionals (opcional)',
  'page.cic-register.summary.notes-placeholder':
    'Afegeix notes addicionals si ho desitges',
  'page.cic-register.summary.save-button': 'Desa registre',
  'page.cic-register.summary.success': 'Registre desat correctament',
  'page.cic-register.summary.error': 'Error desant el registre',

  // Components
  'component.register-cic-button.label': 'Registrar Cateterisme (CIC)',
  'component.register-cic-button.subtitle': 'Cateterisme Intermitent Net',
  'component.register-cic-button.description':
    'Registra volum, color i incomoditat',
  'component.register-stool-button.label': 'Registrar Deposició',
  'component.register-stool-button.subtitle': 'Moviment Intestinal',
  'component.register-stool-button.description':
    'Seguiment de consistència i freqüència',
  'component.register-medication-button.label': 'Registrar Medicació',
  'component.register-medication-button.subtitle': 'Administració de Medicines',
  'component.register-medication-button.description':
    'Registra medicació i dosi',
  'component.filter-button.label': 'Filtres',
  'component.filter-button.all-types': 'Tots els tipus',
  'component.stat-card.cic-label': 'Cateterismes',
  'component.stat-card.stool-label': 'Deposicions',
  'component.stat-card.medication-label': 'Medicació',
  'component.stat-card.today': 'Avui',
  'page.report.debug-stats': 'Depurar: estadístiques',
  'page.report.debug-trendItems': 'Depurar: elements de tendència',

  // History detail ranges
  'page.history-detail.range.today': 'Avui',
  'page.history-detail.range.7d': 'Últims 7 dies',
  'page.history-detail.range.30d': 'Últims 30 dies',
  'page.history-detail.range.90d': 'Últims 90 dies',

  // Accessibility
  'a11y.button.register-cic': 'Botó per registrar cateterisme',
  'a11y.button.register-stool': 'Botó per registrar deposició',
  'a11y.button.register-medication': 'Botó per registrar medicació',
  'a11y.button.open-filters': 'Obrir filtres',
  'a11y.button.view-all-history': 'Veure tota la història',
  'a11y.button.child-profile': 'Veure perfil del nen',
  'a11y.button.manage-carers': 'Gestionar cuidadors',
  'a11y.button.app-settings': "Ajustos de l'aplicació",
  'a11y.button.about': 'Sobre',
  'a11y.button.logout': 'Tanca sessió',
  'a11y.hint.opens-cic-form': 'Obre el formulari de registre de cateterisme',
  'a11y.hint.opens-stool-form': 'Obre el formulari de registre de deposició',
  'a11y.hint.opens-medication-form':
    'Obre el formulari de registre de medicació',
  'a11y.hint.opens-filter-modal': 'Obre la modal de filtres',
  'a11y.hint.opens-child-profile': 'Obre la pantalla de perfil del nen',
  'a11y.hint.opens-carer-management': 'Obre la pantalla de gestió de cuidadors',
  'a11y.hint.opens-app-settings': "Obre la pantalla d'ajustos de l'aplicació",
  'a11y.hint.opens-about': 'Obre la pantalla sobre',
  'a11y.hint.logout-action': 'Tanca la teva sessió actual',
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
  'hook.add-demo-data.error-title': 'Error en Afegir Dades de Demo',
  'hook.add-demo-data.success-title': 'Dades de Demo Afegides Exitosament',
  'hook.add-demo-data.success-description':
    "Les dades de demo s'han afegit exitosament",
  'hook.add-demo-data.error-description':
    'Va ocórrer un error en afegir les dades de demo',
  'hook.get-record-field-distribution.error':
    'Error obtenint distribució del camp',
  'page.settings.section-configuration': 'Configuració',
} satisfies Record<Ti18nKeys, string>);
