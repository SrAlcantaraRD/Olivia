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

// TODO: Generate a zod schema generator, and use it for parse use-case response. ex: return Response<use-case-name>Schema.parse(response)
export type IBaseResponse<T> = IBaseResponseSuccess<T> | IBaseResponseError;
