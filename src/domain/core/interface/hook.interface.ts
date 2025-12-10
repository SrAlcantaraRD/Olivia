interface IHookSuccess<T> {
  success: true;
  data: T;
}

interface IHookError {
  success: false;
}

export type IHookResponse<T> = IHookSuccess<T> | IHookError;

export type IUseHook<TRequest, TResponse> = {
  execute: (
    data: TRequest,
    reload?: boolean
  ) => Promise<IHookResponse<TResponse>>;
  isExecuting: boolean;
  items: TResponse;
};
