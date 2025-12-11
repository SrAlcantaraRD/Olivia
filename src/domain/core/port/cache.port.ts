export interface ICachePort {
  delete(key: string): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  clearAll(): Promise<void>;
}

export const CACHE_KEY_ENUM = {
  CARER: 'CACHE_CARER',
  CARER_PIN_HASH: 'CACHE_CARER_PIN_HASH',
  PATIENT: 'CACHE_PATIENT',
  MODULES: 'CACHE_MODULES',
  APP_THEME: 'CACHE_APP_THEME',
  APP_LOCALE: 'CACHE_APP_LOCALE',
} as const;

export type TCacheKey = (typeof CACHE_KEY_ENUM)[keyof typeof CACHE_KEY_ENUM];
