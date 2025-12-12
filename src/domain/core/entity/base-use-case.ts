import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';

export abstract class BaseUseCase<BaseRequest, BaseResponse> {
  abstract execute(args: BaseRequest): Promise<IBaseResponse<BaseResponse>>;
}
