/// <reference types="jest" />

import { ErrorWhenSetupParent } from '@/domain/carer/error/carer-create.errors';
import type { TRequestSetupParent } from '@/domain/carer/use-case-schema/setup-parent.use-case-schema';
import { SetupParentUseCase } from '@/domain/carer/use-case/setup-parent.use-case';
import { ErrorDatabaseDefault } from '@/domain/core/error/database-default.error';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import type { TID } from '@/domain/core/schemas/id.schema';
import { mockCachePort } from '../../core/mocks/mock.cache.port';
import { mockLoggerPort } from '../../core/mocks/mock.port';
import { mockModuleEntity } from '../../module/mocks/mock.entities';
import { mockModulePort } from '../../module/mocks/mock.port';
import {
  mockPatientCreate,
  mockPatientEntity,
} from '../../patient/mocks/mock.entities';
import { mockPatientPort } from '../../patient/mocks/mock.port';
import { mockCarerCreate, mockCarerEntity } from '../mocks/mock.entities';
import { mockCarerPort } from '../mocks/mock.port';

describe('[UseCase] - Setup Parent', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const patientAdapter = mockPatientPort();
    const moduleAdapter = mockModulePort();
    const cacheAdapter = mockCachePort();
    const secureStoreAdapter = mockCachePort();

    const useCase = new SetupParentUseCase(
      loggerAdapter,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter
    );

    return {
      useCase,
      loggerAdapter,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates carer, patient and activates modules (happy path)', async () => {
    const {
      useCase,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    } = prepareSuiteCase();

    const carerDTO = mockCarerCreate();
    const patientDTO = mockPatientCreate();
    const moduleList = [mockModuleEntity().id];
    const createdCarer = mockCarerEntity();
    const createdPatient = mockPatientEntity({ id: 2 });

    carerAdapter.create.mockResolvedValue(createdCarer);
    patientAdapter.create.mockResolvedValue(createdPatient);
    moduleAdapter.batchActivate.mockResolvedValueOnce(undefined);
    cacheAdapter.set.mockResolvedValue(undefined);
    secureStoreAdapter.set.mockResolvedValue(undefined);

    const response = await useCase.execute({
      parent: carerDTO,
      patient: patientDTO,
      moduleList,
    });

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(moduleList);
    expect(cacheAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.CARER,
      createdCarer
    );
    expect(secureStoreAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.CARER_PIN_HASH,
      createdCarer.pinHash
    );
    expect(response.success).toBe(true);
  });

  it('throws when payload is invalid', async () => {
    const { useCase } = prepareSuiteCase();

    const invalidRequest = {} as unknown as TRequestSetupParent;
    await expect(useCase.execute(invalidRequest)).rejects.toThrow(
      ErrorWhenSetupParent
    );
    // Note: Since it's instance check, and code is 'INVALID_PAYLOAD', but test doesn't assert code
  });

  it('throws when carer creation fails', async () => {
    const {
      useCase,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    } = prepareSuiteCase();

    const carerDTO = mockCarerCreate();
    const patientDTO = mockPatientCreate();
    const moduleList: TID[] = [];
    const createdCarer = mockCarerEntity();

    carerAdapter.create.mockResolvedValue(createdCarer);
    carerAdapter.create.mockRejectedValueOnce(
      new ErrorDatabaseDefault('FAKE_ERROR', 'Database error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).not.toHaveBeenCalled();
    expect(moduleAdapter.batchActivate).not.toHaveBeenCalled();
    expect(cacheAdapter.set).not.toHaveBeenCalled();
    expect(secureStoreAdapter.set).not.toHaveBeenCalled();
  });

  it('throws when patient creation fails', async () => {
    const {
      useCase,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    } = prepareSuiteCase();

    const carerDTO = mockCarerCreate();
    const patientDTO = mockPatientCreate();
    const moduleList: TID[] = [];
    const createdCarer = mockCarerEntity();

    carerAdapter.create.mockResolvedValue(createdCarer);
    patientAdapter.create.mockRejectedValueOnce(
      new ErrorDatabaseDefault('FAKE_ERROR', 'Database error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).not.toHaveBeenCalled();
    expect(cacheAdapter.set).not.toHaveBeenCalled();
    expect(secureStoreAdapter.set).not.toHaveBeenCalled();
  });

  it('throws when module activation fails', async () => {
    const {
      useCase,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    } = prepareSuiteCase();
    const carerDTO = mockCarerCreate();
    const patientDTO = mockPatientCreate();
    const moduleList = [mockModuleEntity().id];
    const createdCarer = mockCarerEntity();
    const createdPatient = mockPatientEntity({ id: 2 });

    carerAdapter.create.mockResolvedValue(createdCarer);
    patientAdapter.create.mockResolvedValue(createdPatient);
    moduleAdapter.batchActivate.mockRejectedValueOnce(
      new ErrorDatabaseDefault('FAKE_ERROR', 'Database error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(moduleList);
    expect(cacheAdapter.set).not.toHaveBeenCalled();
    expect(secureStoreAdapter.set).not.toHaveBeenCalled();
  });

  it('throws when cache set fails', async () => {
    const {
      useCase,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    } = prepareSuiteCase();
    const carerDTO = mockCarerCreate();
    const patientDTO = mockPatientCreate();
    const moduleList = [mockModuleEntity().id];
    const createdCarer = mockCarerEntity();
    const createdPatient = mockPatientEntity({ id: 2 });

    carerAdapter.create.mockResolvedValue(createdCarer);
    patientAdapter.create.mockResolvedValue(createdPatient);
    moduleAdapter.batchActivate.mockResolvedValue(undefined);
    cacheAdapter.set.mockRejectedValueOnce(new Error('Cache error'));

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(moduleList);
    expect(cacheAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.CARER,
      createdCarer
    );
    expect(secureStoreAdapter.set).not.toHaveBeenCalled();
  });

  it('throws when secure store set fails', async () => {
    const {
      useCase,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    } = prepareSuiteCase();
    const carerDTO = mockCarerCreate();
    const patientDTO = mockPatientCreate();
    const moduleList = [mockModuleEntity().id];
    const createdCarer = mockCarerEntity();
    const createdPatient = mockPatientEntity({ id: 2 });

    carerAdapter.create.mockResolvedValue(createdCarer);
    patientAdapter.create.mockResolvedValue(createdPatient);
    moduleAdapter.batchActivate.mockResolvedValue(undefined);
    cacheAdapter.set.mockResolvedValue(undefined);
    secureStoreAdapter.set.mockRejectedValueOnce(
      new Error('Secure store error')
    );

    await expect(
      useCase.execute({ parent: carerDTO, patient: patientDTO, moduleList })
    ).rejects.toBeInstanceOf(ErrorWhenSetupParent);

    expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    expect(patientAdapter.create).toHaveBeenCalledWith(patientDTO);
    expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(moduleList);
    expect(cacheAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.CARER,
      createdCarer
    );
    expect(secureStoreAdapter.set).toHaveBeenCalledWith(
      CACHE_KEY_ENUM.CARER_PIN_HASH,
      createdCarer.pinHash
    );
  });
});
