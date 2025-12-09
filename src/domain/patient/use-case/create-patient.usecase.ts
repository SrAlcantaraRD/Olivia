import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { TPatientDTO } from '@/domain/patient/dto/patient.dto';
import type { TPatientCreateDTO } from '@/domain/patient/entity/patient.entity';
import { ErrorWhenCreatePatien } from '@/domain/patient/errors';
import type { IPatientPort } from '@/domain/patient/port/patient.port';
import { CreatePatientSchema } from '@/domain/patient/use-case-schema/create-patient.use-case-schema';

type CreatePatientInput = TPatientCreateDTO & { moduleIds?: number[] };

export class CreatePatientUseCase extends BaseUseCase<
  CreatePatientInput,
  TPatientDTO
> {
  constructor(private readonly patientPort: IPatientPort) {
    super();
  }

  public async execute(
    dto: CreatePatientInput
  ): Promise<IBaseResponse<TPatientDTO>> {
    const parse = CreatePatientSchema.safeParse({
      name: dto.name,
      birthDate: dto.birthDate,
      sex: dto.sex,
      autonomyLevel: dto.autonomyLevel,
      moduleIds: dto.moduleIds,
    });

    if (!parse.success) {
      throw new ErrorWhenCreatePatien(
        'INVALID_PAYLOAD',
        'Invalid patient payload'
      );
    }

    try {
      const created = await this.patientPort.create(
        dto as TPatientCreateDTO,
        dto.moduleIds ?? []
      );

      return {
        success: true,
        message: 'common.success',
        details: created as unknown as TPatientDTO,
      } as IBaseResponse<TPatientDTO>;
    } catch (err) {
      throw new ErrorWhenCreatePatien(
        'CREATE_FAILED',
        'Failed to create patient'
      );
    }
  }
}
