import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

type IBase = {
  message: Ti18nKeys;
};

type IBaseResponseError = IBase & {
  success: false;
};

type IBaseResponseSuccessEmpty = IBase & {
  success: true;
};

type IBaseResponseSuccessWithData<T> = IBase & {
  success: true;
  details: T;
};

type IBaseResponseSuccess<T> = T extends null | undefined
  ? IBaseResponseSuccessEmpty
  : IBaseResponseSuccessWithData<T>;

export type IBaseResponse<T> = IBaseResponseSuccess<T> | IBaseResponseError;
