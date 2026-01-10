/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { CreateCarerUseCase } from '@/domain/carer/use-case/create-carer.use-case';
import {
  mockCarerCreate,
  mockCarerEntity,
} from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - CreateCarer', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const useCase = new CreateCarerUseCase({
      loggerAdapter,
      carerAdapter,
    });
    return { useCase, loggerAdapter, carerAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should create a carer successfully', async () => {
      const { useCase, carerAdapter } = prepareSuiteCase();
      const carerDTO = mockCarerCreate();
      const createdCarer = mockCarerEntity();

      carerAdapter.create.mockResolvedValue(createdCarer);

      const response = await useCase.execute(carerDTO);

      expect(response.success).toBe(true);
      expect(response.details).toEqual(createdCarer);
      expect(carerAdapter.create).toHaveBeenCalledWith(carerDTO);
    });
  });

  describe('Negative Path', () => {
    it('should throw error when payload is invalid', async () => {
      const { useCase } = prepareSuiteCase();

      await expect(
        useCase.execute({
          name: '',
          isPrimary: true,
          pinHash: 'test',
          type: 'INVALID_TYPE' as any,
        })
      ).rejects.toThrow();
    });

    it('should throw error when adapter creation fails', async () => {
      const { useCase, carerAdapter } = prepareSuiteCase();
      const carerDTO = mockCarerCreate();

      carerAdapter.create.mockRejectedValue(new Error('DB error'));

      await expect(useCase.execute(carerDTO)).rejects.toThrow();
    });
  });
});
