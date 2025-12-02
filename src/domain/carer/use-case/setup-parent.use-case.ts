import { ErrorWhenSetupParent } from '@/domain/carer/error/carer-create.errors';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestSetupParentSchema,
  type TRequestSetupParent,
  type TResponseSetupParent,
} from '@/domain/carer/use-case-schema/setup-parent.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { BaseError } from '@/domain/core/entity/base-error';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

export class SetupParentUseCase extends BaseUseCase<
  TRequestSetupParent,
  TResponseSetupParent
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly carerAdapter: ICarerPort,
    private readonly patientAdapter: IPatientPort,
    private readonly moduleAdapter: IModulePort
  ) {
    super('setup-parent', loggerAdapter);
  }

  public async execute(
    request: TRequestSetupParent
  ): Promise<IBaseResponse<TResponseSetupParent>> {
    const parse = RequestSetupParentSchema.safeParse(request);

    if (!parse.success) {
      const details = parse.error.message;

      this.logError('SetupParentUseCase', details);

      throw new ErrorWhenSetupParent('INVALID_PAYLOAD', details);
    }

    const { parent, patient, moduleList } = parse.data;

    try {
      await this.carerAdapter.create(parent);

      await this.patientAdapter.create(patient);

      await this.moduleAdapter.batchActivate(moduleList);
    } catch (error) {
      let details = error instanceof Error ? error.message : 'Unexpected error';
      if (!(error instanceof BaseError)) {
        details = 'Unexpected error not instance of BaseError';
      }

      this.logError('SetupParentUseCase', details);

      throw new ErrorWhenSetupParent(
        'FAILED_SETUP_PARENT',
        `Could not complete parent setup: ${details}`
      );
    }

    return {
      success: true,
      message: 'common.success',
      details: undefined,
    };
  }
}
