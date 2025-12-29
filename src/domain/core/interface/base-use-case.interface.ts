import z from 'zod';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';

type TParseRequestSuccess<T> = {
  success: true;
  data: T;
};

type TParseRequestResult<T> = TParseRequestSuccess<T>;

export abstract class BaseUseCase<BaseRequest, BaseResponse> {
  abstract execute(args: BaseRequest): Promise<IBaseResponse<BaseResponse>>;

  constructor(
    private readonly useCaseName: string,
    public readonly loggerAdapter: TLoggerPort
  ) {}

  protected logDebug(message: string, details?: unknown): void {
    this.loggerAdapter.debug({ useCase: this.useCaseName, message, details });
  }

  protected logError(message: string, details?: unknown): void {
    this.loggerAdapter.error({ useCase: this.useCaseName, message, details });
  }

  protected parseRequest<T>(
    schema: z.ZodType<T>,
    request: unknown
  ): TParseRequestResult<T> {
    const parsed = schema.safeParse(request);

    if (!parsed.success) {
      const errorList = z.treeifyError(parsed.error).errors;
      const errorMessage = errorList.join(', ');

      this.logError('Error on parsing request', errorMessage);

      throw new ErrorCannotParseSchema('Invalid request schema', errorMessage);
    }

    return {
      success: true,
      data: parsed.data,
    };
  }
}
