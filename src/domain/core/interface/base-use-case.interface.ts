import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';

export abstract class BaseUseCase<BaseRequest, BaseResponse> {
  abstract execute(args: BaseRequest): Promise<IBaseResponse<BaseResponse>>;

  constructor(
    private readonly useCaseName: string,
    public readonly loggerAdapter: TLoggerPort
  ) {}

  protected logDebug(message: string, details?: unknown): void {
    this.loggerAdapter.debug(this.useCaseName, message, details);
  }

  protected logError(message: string, details?: unknown): void {
    this.loggerAdapter.error(this.useCaseName, message, details);
  }

  // protected validateRequest<T>(schema: z.ZodType<T>, request: unknown): T {
  //   const parsed = schema.safeParse(request);

  //   if (!parsed.success) {
  //     const errorList = z.treeifyError(parsed.error).errors;
  //     this.logError('Error on parsing request', errorList.join(', '));
  //     throw new Error(`Invalid request: ${errorList.join(', ')}`);
  //   }

  //   return parsed.data;
  // }
}
