interface IHookSuccess<T> {
  success: true;
  data: T;
}

interface IHookError {
  success: false;
}

export type IHookResponse<T> = IHookSuccess<T> | IHookError;

export type IUseHook<TRequestDTO, TResponseDTO> = {
  execute: (
    data: TRequestDTO,
    reload?: boolean
  ) => Promise<IHookResponse<TResponseDTO>>;
  isExecuting: boolean;
};
