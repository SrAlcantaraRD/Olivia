/// <reference types="jest" />

import { ErrorWhenSetupParent } from '@/domain/carer/error/carer-create.errors';
import { SetupParentUseCase } from '@/domain/carer/use-case/setup-parent.use-case';
import type { TRequestSetupParent } from '@/domain/carer/use-case-schema/setup-parent.use-case-schema';
import { ErrorDatabaseDefault } from '@/domain/core/error/database-default.error';
import type { TID } from '@/domain/core/schemas/id.schema';
import { mockLoggerPort } from '../../core/mocks/mock.port';
import { mockModuleEntity } from '../../module/mocks/mock.entities';
import { mockModulePort } from '../../module/mocks/mock.port';
import { mockPatientCreateDTO } from '../../patient/mocks/mock.dtos';
import { mockPatientPort } from '../../patient/mocks/mock.port';
import { mockCarerCreateDTO } from '../mocks/mock.dtos';
import { mockCarerPort } from '../mocks/mock.port';

describe('[UseCase] - Setup Parent', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const patientAdapter = mockPatientPort();
    const moduleAdapter = mockModulePort();

    const useCase = new SetupParentUseCase(
      loggerAdapter,
      carerAdapter,
      patientAdapter,
      moduleAdapter
    );

    return {
      useCase,
      loggerAdapter,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates carer, patient and activates modules (happy path)', async () => {
    const { useCase, carerAdapter, patientAdapter, moduleAdapter } =
      prepareSuiteCase();

    const carerDTO = mockCarerCreateDTO();
    const patientDTO = mockPatientCreateDTO();
    const moduleList = [99];

    moduleAdapter.batchActivate.mockResolvedValueOnce(undefined);

    const response = await useCase.execute({
      parent: carerDTO,
      patient: patientDTO,
      moduleList,
    });

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(moduleList);
    expect(response.success).toBe(true);
  });

  it('throws when payload is invalid', async () => {
    const { useCase } = prepareSuiteCase();

    const invalidRequest = {} as unknown as TRequestSetupParent;
    await expect(useCase.execute(invalidRequest)).rejects.toBeInstanceOf(
      ErrorWhenSetupParent
    );
  });

  it('throws when carer creation fails', async () => {
    const { useCase, carerAdapter, patientAdapter, moduleAdapter } =
      prepareSuiteCase();

    const carerDTO = mockCarerCreateDTO();
    const patientDTO = mockPatientCreateDTO();
    const moduleList: TID[] = [];

    carerAdapter.create.mockRejectedValueOnce(
      new ErrorDatabaseDefault('FAKE_ERROR', 'Database error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).not.toHaveBeenCalled();
    expect(moduleAdapter.batchActivate).not.toHaveBeenCalled();
  });

  it('throws when patient creation fails', async () => {
    const { useCase, carerAdapter, patientAdapter, moduleAdapter } =
      prepareSuiteCase();

    const carerDTO = mockCarerCreateDTO();
    const patientDTO = mockPatientCreateDTO();
    const moduleList: TID[] = [];

    patientAdapter.create.mockRejectedValueOnce(
      new ErrorDatabaseDefault('FAKE_ERROR', 'Database error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).not.toHaveBeenCalled();
  });

  it('throws when module activation fails', async () => {
    const { useCase, carerAdapter, patientAdapter, moduleAdapter } =
      prepareSuiteCase();
    const carerDTO = mockCarerCreateDTO();
    const patientDTO = mockPatientCreateDTO();
    const moduleList = [mockModuleEntity().id];

    moduleAdapter.batchActivate.mockRejectedValueOnce(
      new ErrorDatabaseDefault('FAKE_ERROR', 'Database error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(moduleList);
  });
});
