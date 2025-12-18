/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetModuleFieldListUseCase } from '@/domain/module/use-case/get-module-field-list.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockModuleFieldPort } from '@/tests/mocks/module-field.port.mock';

describe('[UseCase] - GetModuleFieldList', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const moduleFieldAdapter = mockModuleFieldPort();
    const unit = new GetModuleFieldListUseCase({
      loggerAdapter,
      moduleFieldAdapter,
    });
    return { unit, loggerAdapter, moduleFieldAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns fields for specified module when adapter returns data', async () => {
      const { unit, moduleFieldAdapter } = prepareSuiteCase();
      const moduleID = 123;
      const fields = [
        mockModuleFieldEntity({ id: 1, moduleId: moduleID, title: 'Field1' }),
        mockModuleFieldEntity({ id: 2, moduleId: moduleID, title: 'Field2' }),
      ];
      moduleFieldAdapter.getAllByModuleId.mockResolvedValue(fields);

      // Act
      const response = await unit.execute({ moduleID });

      // Assert
      expect(response.success).toBe(true);

      if (!response.success) {
        throw new Error('Expected success response');
      }
      expect(response.details.items).toEqual(fields);
      expect(moduleFieldAdapter.getAllByModuleId).toHaveBeenCalledWith(
        moduleID
      );
    });
  });
});
