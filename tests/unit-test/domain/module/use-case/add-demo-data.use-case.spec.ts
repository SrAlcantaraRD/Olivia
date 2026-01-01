/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { AddDemoDataUseCase } from '@/domain/module/use-case/add-demo-data.use-case';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import {
  mockModuleFieldPort,
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks/module-field.port.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';

describe('[UseCase] - AddDemoData', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const moduleAdapter = mockModulePort();
    const moduleFieldAdapter = mockModuleFieldPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();

    const useCase = new AddDemoDataUseCase({
      loggerAdapter,
      carerAdapter,
      moduleAdapter,
      moduleFieldAdapter,
      recordAdapter,
      recordFieldAdapter,
    });

    return {
      useCase,
      loggerAdapter,
      carerAdapter,
      moduleAdapter,
      moduleFieldAdapter,
      recordAdapter,
      recordFieldAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns success when there is a primary carer but no active modules', async () => {
      const { useCase, carerAdapter, moduleAdapter, recordAdapter } =
        prepareSuiteCase();
      const primaryCarer = mockCarerEntity();
      carerAdapter.getAll.mockResolvedValue([primaryCarer]);
      moduleAdapter.getAll.mockResolvedValue([
        mockModuleEntity({ isActive: false }),
      ]);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success response');
      }

      expect(moduleAdapter.getAll).toHaveBeenCalled();
      expect(recordAdapter.create).not.toHaveBeenCalled();
    });
  });

  describe('Negative Path', () => {
    it('returns failure when no carer is found', async () => {
      const { useCase, carerAdapter, moduleAdapter } = prepareSuiteCase();
      carerAdapter.getAll.mockResolvedValue([]);

      const response = await useCase.execute();

      expect(response.success).toBe(false);
      expect(response.message).toBe('error.no-carer-found');
      expect(moduleAdapter.getAll).not.toHaveBeenCalled();
    });
  });
});
