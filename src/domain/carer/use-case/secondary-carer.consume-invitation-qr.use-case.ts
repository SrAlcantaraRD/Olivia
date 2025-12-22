import z from 'zod';

import {
  InviteSecondaryCarerQRSchema,
  type TInviteSecondaryCarerQRPayload,
} from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import type { TCarerCreate } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestSecondaryCarerConsumeInvitationQRSchema,
  type TRequestSecondaryCarerConsumeInvitation,
  type TResponseSecondaryCarerConsumeInvitation,
} from '@/domain/carer/use-case-schema/secondary-carer.consume-invitation-qr.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { TQR } from '@/domain/core/dto/qr.dto';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import { CACHE_KEY_ENUM, type ICachePort } from '@/domain/core/port/cache.port';
import type { IQRPort } from '@/domain/core/port/qr.port';

export class SecondaryCarerConsumeInvitationQRUseCase extends BaseUseCase<
  TRequestSecondaryCarerConsumeInvitation,
  TResponseSecondaryCarerConsumeInvitation
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      carerAdapter: ICarerPort;
      qrAdapter: IQRPort;
      cacheAdapter: ICachePort;
    }
  ) {
    super('secondary-carer-consume-invitation-qr', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestSecondaryCarerConsumeInvitation
  ): Promise<IBaseResponse<TResponseSecondaryCarerConsumeInvitation>> {
    this.logDebug(JSON.stringify(request));

    const parse =
      RequestSecondaryCarerConsumeInvitationQRSchema.safeParse(request);

    if (!parse.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parse.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message: 'use-case.create-secondary-carer.invalid-request',
      };
    }

    const { qrBundle } = parse.data;

    const rawData: TQR<TInviteSecondaryCarerQRPayload> =
      await this.adapters.qrAdapter.decodeFromBundle(qrBundle);

    const parsedData = InviteSecondaryCarerQRSchema.safeParse({
      ...rawData,
      payload: {
        ...rawData.payload,
        expiresAt: new Date(rawData.payload.expiresAt),
      },
    });

    if (!parsedData.success) {
      const errorList = z.treeifyError(parsedData.error).errors;
      this.adapters.loggerAdapter.error({
        message: 'Invalid QR data',
        errors: errorList,
      });

      return {
        success: false,
        message:
          'use-case.secondary-carer-consume-invitation-qr.invalid-qr-data',
      };
    }

    const {
      payload: { expiresAt, id: originalCarerID, name },
    } = parsedData.data;

    const carerExists =
      await this.adapters.carerAdapter.getByID(originalCarerID);

    if (carerExists) {
      this.adapters.cacheAdapter.set(
        CACHE_KEY_ENUM.SECONDARY_CARER_EXPIRES_AT,
        expiresAt.getTime()
      );

      this.adapters.loggerAdapter.info({
        message: `Secondary carer with ID ${originalCarerID} already exists.`,
      });

      return {
        success: true,
        message: 'use-case.secondary-carer-consume-invitation-qr.carer-exists',
      };
    }

    const carerPayload: TCarerCreate = {
      name: name,
      type: CARER_TYPE_ENUM.SECONDARY,
      isPrimary: false,
      pinHash: '',
    };

    const carer = await this.adapters.carerAdapter.addSecondaryCarer(
      originalCarerID,
      carerPayload
    );

    this.adapters.cacheAdapter.set(
      CACHE_KEY_ENUM.SECONDARY_CARER_EXPIRES_AT,
      expiresAt.getTime()
    );

    return {
      success: true,
      message: 'common.success',
      details: {
        carer,
      },
    };
  }
}
