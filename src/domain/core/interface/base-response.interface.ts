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

// TODO: BaseResponseSuccess should be always with success true, and if anythinkg is wrong, then should throw a domain error and the base-hook will catch it and show the message.
type IBaseResponseSuccess<T> = T extends null | undefined
  ? IBaseResponseSuccessEmpty
  : IBaseResponseSuccessWithData<T>;

// TODO: Generate a zod schema generator, and use it for parse use-case response. ex: return Response<use-case-name>Schema.parse(response)
export type IBaseResponse<T> = IBaseResponseSuccess<T> | IBaseResponseError;
