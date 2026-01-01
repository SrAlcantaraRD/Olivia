export const CACHE_KEY_ENUM = Object.freeze({
  CARER: 'cache-carer',
  CARER_PIN_HASH: 'cache-carer-pin-hash',
  PATIENT: 'cache-patient',
  MODULES: 'cache-modules',
  APP_THEME: 'cache-app-theme',
  APP_LOCALE: 'cache-app-locale',
  REPORT_DISTRIBUTION: 'report_distribution',
  SUMMARY_SNAPSHOT: 'summary_snapshot',
  SECONDARY_CARER_EXPIRES_AT: 'secondary-carer',
} as const);

export type TCacheKey = (typeof CACHE_KEY_ENUM)[keyof typeof CACHE_KEY_ENUM];

export const buildCacheKey = (
  baseKey: TCacheKey,
  ...parts: (string | number)[]
): TCacheKey => {
  return `${baseKey}:${parts.join(':')}` as TCacheKey;
};
