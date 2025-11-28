export const enEN = {
  welcome: 'Welcome',
  next: 'Next',
  parent: 'Parent',
  caregiver: 'Caregiver',
  finish: 'Finish',
  skip: 'Skip',
  continue: 'Continue',
  'start-onboarding': 'Start onboarding',
  'add-register': 'Add Register',
  // Splash Screen
  'splash-screen.app-name': 'Oliva',
  'splash-screen.tagline': 'Cuidar. Registrar. Respirar.',
  'splash-screen.privacy-notice': 'Tus datos se guardan solo en tu móvil',
  // Onboarding
  'onboarding-screen.slider.care-with-peace.title':
    'We help you care with peace of mind.',
  'onboarding-screen.slider.care-with-peace.description':
    'Record catheterizations and routines quickly, clearly and offline.',
  'onboarding-screen.slider.slogan.title':
    'Fast. Guided. Designed for your daily life.',
  'onboarding-screen.slider.slogan.bullet.record-in-seconds':
    'Record in seconds',
  'onboarding-screen.slider.slogan.bullet.one-step-at-a-time':
    'One step at a time',
  'onboarding-screen.slider.slogan.bullet.perfect-for-busy-routines':
    'Perfect for busy routines',
  'onboarding-screen.slider.data-control.title':
    'Your data, under your control.',
  'onboarding-screen.slider.data-control.description':
    'Everything stays on your phone. No cloud. No accounts.\nYou decide who to share with.',
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
  'parent-setup.summary.title': 'Revisa tu información',
  'parent-setup.summary.description':
    'Confirma que todo es correcto antes de continuar',
  'parent-setup.summary.parent-section': 'Información del Tutor',
  'parent-setup.summary.parent-name': 'Nombre',
  'parent-setup.summary.parent-relationship': 'Relación',
  'parent-setup.summary.child-section': 'Información del Menor',
  'parent-setup.summary.child-name': 'Nombre',
  'parent-setup.summary.child-birth-date': 'Fecha de nacimiento',
  'parent-setup.summary.child-diagnosis': 'Diagnóstico',
  'parent-setup.summary.modules-section': 'Módulos Activados',
  'parent-setup.summary.no-modules': 'No hay módulos seleccionados',
};

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends object
    ? `${TKey}${'.'}${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

export type Ti18nKeys = RecursiveKeyOf<typeof enEN>;
