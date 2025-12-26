import { addDays, addMonths, addWeeks, endOfDay } from 'date-fns';
import z from 'zod';

import type {
  TInviteSecondaryCarerQRActiveModule,
  TInviteSecondaryCarerQRPayload,
} from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestSecondaryCarerGenerateInvitationQRSchema,
  type TRequestSecondaryCarerGenerateInvitationQR,
  type TResponseSecondaryCarerGenerateInvitationQR,
} from '@/domain/carer/use-case-schema/secondary-carer.generate-invitation-qr.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/entity-not-found-by.error';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { IQRPort } from '@/domain/core/port/qr.port';
import { WorkWithQRBaseUseCase } from '@/domain/module/abstract/work-with-qr.use-case-abstract';
import type { IModulePort } from '@/domain/module/port/module.port';

export class SecondaryCarerGenerateInvitationQRUseCase extends WorkWithQRBaseUseCase<
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
    super(
      'generate-invitation-qr-for-secondary-carer',
      adapters.qrAdapter,
      adapters.loggerAdapter
    );
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
        [QR_KEY.ORIGIN_CARER_ID]: carer.id,
        [QR_KEY.ORIGIN_CARER_NAME]: carer.name,
        [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: expiresAt,
        [QR_KEY.MODULE_LIST]: activeModuleIDList,
      } satisfies TInviteSecondaryCarerQRPayload;

      const qrData = this.generateQRCode(payload);

      const qrBundle = await this.packBundle(qrData);

      return {
        success: true,
        message: 'common.success',
        details: {
          qrBundle,
          qrData,
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

    const map: Record<TIME_TO_LIVE, (date: Date, amount: number) => Date> = {
      [TIME_TO_LIVE.ONE_DAY]: addDays,
      [TIME_TO_LIVE.ONE_WEEK]: addWeeks,
      [TIME_TO_LIVE.ONE_MONTH]: addMonths,
    };

    expiresAt = map[timeToLive](now, 1);

    expiresAt = endOfDay(expiresAt);

    return expiresAt;
  }

  private async getActiveModuleIDList(): Promise<
    TInviteSecondaryCarerQRActiveModule[]
  > {
    const moduleList = await this.adapters.moduleAdapter.getAll();

    return moduleList.map((module) => {
      return {
        [QR_KEY.MODULE_ID]: module.id,
        [QR_KEY.MODULE_FIELD_LIST]: (module.fieldList ?? [])
          .filter((field) => field.status === STATUS_ENUM.ACTIVE)
          .map((field) => field.id),
      } satisfies TInviteSecondaryCarerQRActiveModule;
    });
  }
}
