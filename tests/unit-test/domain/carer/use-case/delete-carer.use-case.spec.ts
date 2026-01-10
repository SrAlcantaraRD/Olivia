/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { DeleteCarerUseCase } from '@/domain/carer/use-case/delete-carer.use-case';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - DeleteCarer', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const useCase = new DeleteCarerUseCase({
      loggerAdapter,
      carerAdapter,
    });
    return { useCase, loggerAdapter, carerAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should delete (mark as inactive) a carer successfully', async () => {
      const { useCase, carerAdapter } = prepareSuiteCase();
      const carerID = 1;
      const inactiveCarer = mockCarerEntity({
        id: carerID,
        status: STATUS_ENUM.INACTIVE,
      });

      carerAdapter.updateStatus.mockResolvedValue(inactiveCarer);

      const response = await useCase.execute({ carerID });

      expect(response.success).toBe(true);
      expect(carerAdapter.updateStatus).toHaveBeenCalledWith(
        carerID,
        STATUS_ENUM.INACTIVE
      );
    });
  });

  describe('Negative Path', () => {
    it('should return failure when payload is invalid', async () => {
      const { useCase } = prepareSuiteCase();

      const response = await useCase.execute({ carerID: -1 });

      expect(response.success).toBe(false);
    });

    it('should handle adapter errors', async () => {
      const { useCase, carerAdapter } = prepareSuiteCase();

      carerAdapter.updateStatus.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute({ carerID: 1 })).rejects.toThrow();
    });
  });
});
