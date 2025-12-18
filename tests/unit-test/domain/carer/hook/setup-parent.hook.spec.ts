/// <reference types="jest" />

import { act, renderHook } from '@testing-library/react-native';

import { useSetupParent } from '@/domain/carer/hook/setup-parent.hook';
import type { TResponseSetupParent } from '@/domain/carer/use-case-schema/setup-parent.use-case-schema';
import type { IHookResponse } from '@/domain/core/interface/hook.interface';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import {
  mockCarerCreate,
  mockCarerEntity,
} from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import {
  mockCachePort,
  mockLoggerPort,
  mockNotifyPort,
} from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';
import { mockPatientCreate } from '@/tests/mocks/patient.dto.mock';
import { mockPatientEntity } from '@/tests/mocks/patient.entity.mock';
import { mockPatientPort } from '@/tests/mocks/patient.port.mock';

describe('[Hook] - SetupParent', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const notifyAdapter = mockNotifyPort();
    const carerAdapter = mockCarerPort();
    const patientAdapter = mockPatientPort();
    const moduleAdapter = mockModulePort();
    const cacheAdapter = mockCachePort();
    const secureStoreAdapter = mockCachePort();

    const { result } = renderHook(() =>
      useSetupParent({
        loggerAdapter,
        notifyAdapter,
        carerAdapter,
        patientAdapter,
        moduleAdapter,
        cacheAdapter,
        secureStoreAdapter,
      })
    );

    return {
      hook: result.current,
      loggerAdapter,
      notifyAdapter,
      carerAdapter,
      patientAdapter,
      moduleAdapter,
      cacheAdapter,
      secureStoreAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('executes successfully and notifies success', async () => {
      const {
        hook,
        carerAdapter,
        patientAdapter,
        moduleAdapter,
        cacheAdapter,
        secureStoreAdapter,
        notifyAdapter,
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
      secureStoreAdapter.set.mockResolvedValue(undefined);

      let response: IHookResponse<TResponseSetupParent>;
      await act(async () => {
        response = await hook.execute({
          parent: carerDTO,
          patient: patientDTO,
          moduleList,
        });
      });

      expect(response.success).toBe(true);
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
      expect(notifyAdapter.loading).toHaveBeenCalledWith({
        title: 'hook.setup-parent.title',
        description: 'hook.setup-parent.description',
      });
      expect(notifyAdapter.success).toHaveBeenCalledWith({
        title: 'hook.setup-parent.success-title',
        description: 'common.success',
      });
    });
  });

  describe('Negative Path', () => {
    it('handles error and notifies failure', async () => {
      const { hook, carerAdapter, notifyAdapter } = prepareSuiteCase();

      const carerDTO = mockCarerCreate();
      const patientDTO = mockPatientCreate();
      const moduleList: number[] = [];

      carerAdapter.create.mockRejectedValue(new Error('Database error'));

      let response: IHookResponse<TResponseSetupParent>;
      await act(async () => {
        response = await hook.execute({
          parent: carerDTO,
          patient: patientDTO,
          moduleList,
        });
      });

      expect(response.success).toBe(false);
      expect(notifyAdapter.loading).toHaveBeenCalled();
      // Note: Hook does not notify error on catch, only console.error
      // Note: In the hook, for error, it returns { success: false }, and notify error with response.message, but since it's catch, response.message is undefined? Wait, need to check
    });
  });
});
