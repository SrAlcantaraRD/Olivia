/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { GetActiveModuleListUseCase } from '@/domain/module/use-case/get-active-module-list.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';

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
      const expectedItems = [active1, active2].map((module) => ({
        ...module,
        fieldList: [],
      }));

      expect(response.details.items).toEqual(expectedItems);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
    });

    it('filters out inactive module fields when moduleFieldList is present', async () => {
      const { unit, moduleAdapter } = prepareSuiteCase();
      const activeField = mockModuleFieldEntity({ status: STATUS_ENUM.ACTIVE });
      const inactiveField = mockModuleFieldEntity({
        status: STATUS_ENUM.INACTIVE,
      });
      const moduleWithFields = mockModuleEntity({
        id: 1,
        isActive: true,
        moduleFieldList: [activeField, inactiveField],
      });
      moduleAdapter.getAll.mockResolvedValue([moduleWithFields]);

      // Act
      const response = await unit.execute();

      // Assert
      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success response');
      }

      expect(response.details.items).toEqual([
        {
          ...moduleWithFields,
          fieldList: [activeField],
        },
      ]);
    });
  });
});
