import type { TLoggerPort } from '@/domain/core/adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';

export abstract class BaseUseCase<BaseRequest, BaseResponse> {
  abstract execute(args: BaseRequest): Promise<IBaseResponse<BaseResponse>>;

  constructor(
    private readonly useCaseName: string,
    public readonly loggerAdapter: TLoggerPort
  ) {}

  protected logDebug(message: string, details?: unknown): void {
    this.loggerAdapter.debug(message, details);
  }

  protected logError(message: string, details?: unknown): void {
    this.loggerAdapter.error(this.useCaseName, message, details);
  }
}
