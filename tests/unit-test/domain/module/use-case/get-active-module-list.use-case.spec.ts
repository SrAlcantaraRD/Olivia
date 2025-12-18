/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetActiveModuleListUseCase } from '@/domain/module/use-case/get-active-module-list.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
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
      const modules = [
        { id: '1', name: 'Module1', isActive: true },
        { id: '2', name: 'Module2', isActive: false },
        { id: '3', name: 'Module3', isActive: true },
      ];
      moduleAdapter.getAll.mockResolvedValue(modules);

      // Act
      const response = await unit.execute();

      // Assert
      expect(response.success).toBe(true);
      expect(response.details.items).toEqual([
        { id: '1', name: 'Module1', isActive: true },
        { id: '3', name: 'Module3', isActive: true },
      ]);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
    });
  });
});
