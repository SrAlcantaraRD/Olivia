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
};

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends object
    ? `${TKey}${'.'}${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

export type Ti18nKeys = RecursiveKeyOf<typeof enEN>;
