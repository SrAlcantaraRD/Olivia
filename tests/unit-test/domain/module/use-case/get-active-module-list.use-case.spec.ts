/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetActiveModuleListUseCase } from '@/domain/module/use-case/get-active-module-list.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';

describe('[UseCase] - GetActiveModuleList', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const moduleAdapter = mockModulePort();
    const unit = new GetActiveModuleListUseCase({
      loggerAdapter,
      moduleAdapter,
    });
    return { unit, loggerAdapter, moduleAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns only active modules when adapter returns mixed list', async () => {
      const { unit, moduleAdapter } = prepareSuiteCase();
      const active1 = mockModuleEntity({
        id: 1,
        name: 'Module1',
        isActive: true,
      });
      const inactive = mockModuleEntity({
        id: 2,
        name: 'Module2',
        isActive: false,
      });
      const active2 = mockModuleEntity({
        id: 3,
        name: 'Module3',
        isActive: true,
      });
      const modules = [active1, inactive, active2];
      moduleAdapter.getAll.mockResolvedValue(modules);

      // Act
      const response = await unit.execute();

      // Assert
      expect(response.success).toBe(true);

      if (!response.success) {
        throw new Error('Expected success response');
      }
      expect(response.details.items).toEqual([active1, active2]);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
    });
  });
});
