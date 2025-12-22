import { addDays, addMonths, addWeeks, endOfDay } from 'date-fns';
import z from 'zod';

import type { TInviteSecondaryCarerQRPayload } from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestSecondaryCarerGenerateInvitationQRSchema,
  type TRequestSecondaryCarerGenerateInvitationQR,
  type TResponseSecondaryCarerGenerateInvitationQR,
} from '@/domain/carer/use-case-schema/secondary-carer.generate-invitation-qr.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/entity-not-found-by.error';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { IModulePort } from '@/domain/module/port/module.port';

export class SecondaryCarerGenerateInvitationQRUseCase extends BaseUseCase<
  TRequestSecondaryCarerGenerateInvitationQR,
  TResponseSecondaryCarerGenerateInvitationQR
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      carerAdapter: ICarerPort;
      qrAdapter: IQRPort;
      cacheAdapter: ICachePort;
      moduleAdapter: IModulePort;
    }
  ) {
    super('generate-invitation-qr-for-secondary-carer', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestSecondaryCarerGenerateInvitationQR
  ): Promise<IBaseResponse<TResponseSecondaryCarerGenerateInvitationQR>> {
    this.logDebug(JSON.stringify(request));

    const parse =
      RequestSecondaryCarerGenerateInvitationQRSchema.safeParse(request);

    if (!parse.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parse.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message:
          'use-case.generate-invitation-qr-for-secondary-carer.invalid-request',
      };
    }

    const { carerID, timeToLive } = parse.data;

    const carer = await this.adapters.carerAdapter.getByID(carerID);

    if (!carer) {
      throw new ErrorEntityNotFoundBy('Carer', 'id', carerID);
    }

    const activeModuleIDList = await this.getActiveModuleIDList();

    try {
      const expiresAt = this.getExpireAt(timeToLive);

      const payload = {
        id: carer.id,
        name: carer.name,
        expiresAt,
        activeModuleIDList,
      } satisfies TInviteSecondaryCarerQRPayload;

      const qrData =
        await this.adapters.qrAdapter.generateQRCode<TInviteSecondaryCarerQRPayload>(
          payload
        );

      const qrBundle = await this.adapters.qrAdapter.encodeToBundle(qrData);

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
    let expiresAt: Date;

    switch (timeToLive) {
      case TIME_TO_LIVE.ONE_DAY:
        expiresAt = addDays(now, 1);
        break;
      case TIME_TO_LIVE.ONE_WEEK:
        expiresAt = addWeeks(now, 1);
        break;
      case TIME_TO_LIVE.ONE_MONTH:
        expiresAt = addMonths(now, 1);
        break;
      default:
        throw new Error(
          `Invalid timeToLive value: ${timeToLive} in SecondaryCarerGenerateInvitationQRUseCase`
        );
    }

    expiresAt = endOfDay(expiresAt);

    return expiresAt;
  }

  private async getActiveModuleIDList(): Promise<TID[]> {
    const moduleList = await this.adapters.moduleAdapter.getAll();

    return moduleList.map((module) => module.id);
  }
}
