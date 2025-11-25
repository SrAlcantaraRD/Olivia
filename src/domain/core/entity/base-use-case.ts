import type { IBaseResponse } from '@/domain/core';

export abstract class BaseUseCase<BaseRequest, BaseResponse> {
  abstract execute(args: BaseRequest): Promise<IBaseResponse<BaseResponse>>;
}
