import type { TID } from '@/domain/core/schemas/id.schema';

type INotifyType = 'info' | 'success' | 'warning' | 'error';

export interface ILoggerNotify extends INotifyParams {
  type: INotifyType;
}

export interface INotifyAction {
  text: string;
  onPress(): void;
}

export interface INotifyParams {
  title: string;
  description: string;
  actions?: INotifyAction[];
}

interface INotifyHandlerParams {
  description: string;
  id: TID;
  isAutoDismiss: boolean;
  title: string;
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
