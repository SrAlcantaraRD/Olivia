import type { TID } from '@/domain/core/schemas/id.schema';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

type INotifyType = 'info' | 'success' | 'warning' | 'error';

export interface ILoggerNotify extends INotifyParams {
  type: INotifyType;
}

export interface INotifyAction {
  text: Ti18nKeys;
  onPress(): void;
}

export interface INotifyParams {
  title: Ti18nKeys;
  description: Ti18nKeys;
  actions?: INotifyAction[];
}

interface INotifyHandlerParams {
  description: Ti18nKeys;
  id: TID;
  isAutoDismiss: boolean;
  title: Ti18nKeys;
  type: INotifyType;
  actions?: INotifyAction[];
}

export type INotifyHandler = (params: INotifyHandlerParams) => void;

export interface INotifyPort {
  info(params: INotifyParams): void;
  warning(params: INotifyParams): void;
  error(params: INotifyParams): void;
  success(params: INotifyParams): void;
  loading(params: INotifyParams): void;
}
