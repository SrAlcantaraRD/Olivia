import { addDays, addMonths, addWeeks } from 'date-fns';
import z from 'zod';

import type { TInviteSecondaryCarerQRPayload } from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestGenerateInvitationQRForSecondaryCarerSchema,
  type TRequestGenerateInvitationQRForSecondaryCarer,
  type TResponseGenerateInvitationQRForSecondaryCarer,
} from '@/domain/carer/use-case-schema/generate-invitation-qr-for-secondary-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/entity-not-found-by.error';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { IQRPort } from '@/domain/core/port/qr.port';

export class GenerateInvitationQRForSecondaryCarerUseCase extends BaseUseCase<
  TRequestGenerateInvitationQRForSecondaryCarer,
  TResponseGenerateInvitationQRForSecondaryCarer
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      carerAdapter: ICarerPort;
      qrAdapter: IQRPort;
      cacheAdapter: ICachePort;
    }
  ) {
    super('generate-invitation-qr-for-secondary-carer', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestGenerateInvitationQRForSecondaryCarer
  ): Promise<IBaseResponse<TResponseGenerateInvitationQRForSecondaryCarer>> {
    this.logDebug('GenerateInvitationQRForSecondaryCarerUseCase', request);

    const parseResult =
      RequestGenerateInvitationQRForSecondaryCarerSchema.safeParse(request);

    if (!parseResult.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parseResult.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message:
          'use-case.generate-invitation-qr-for-secondary-carer.invalid-request',
      };
    }

    const { carerID, timeToLive } = parseResult.data;

    const carer = await this.adapters.carerAdapter.getByID(carerID);

    if (!carer) {
      throw new ErrorEntityNotFoundBy('Carer', 'id', carerID);
    }

    try {
      const expiresAt = this.getExpireAt(timeToLive);

      const payload = {
        id: carer.id,
        name: carer.name,
        isPrimary: carer.isPrimary,
        type: CARER_TYPE_ENUM.SECONDARY,
        timeToLive,
        expiresAt: expiresAt.toISOString(),
      } satisfies TInviteSecondaryCarerQRPayload;

      const qrData =
        await this.adapters.qrAdapter.generateQRCode<TInviteSecondaryCarerQRPayload>(
          payload
        );

      const qrBundle = await this.adapters.qrAdapter.generateBundle(qrData);

      const qrChunkList =
        await this.adapters.qrAdapter.encodeToChunks(qrBundle);

      return {
        success: true,
        message: 'common.success',
        details: {
          qrBundle,
          qrData,
          qrChunkList,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logError(
        errorMessage || 'Unknown error during QR code generation',
        error instanceof Error ? error.stack : undefined
      );

      return {
        success: false,
        message:
          'use-case.generate-invitation-qr-for-secondary-carer.generation-failed',
      };
    }
  }

  private getExpireAt(timeToLive: TIME_TO_LIVE): Date {
    const now = new Date();

    switch (timeToLive) {
      case TIME_TO_LIVE.ONE_DAY:
        return addDays(now, 1);
      case TIME_TO_LIVE.ONE_WEEK:
        return addWeeks(now, 1);
      case TIME_TO_LIVE.ONE_MONTH:
        return addMonths(now, 1);
      default:
        throw new Error(
          `Invalid timeToLive value: ${timeToLive} in GenerateInvitationQRForSecondaryCarerUseCase`
        );
    }
  }
}
