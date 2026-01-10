/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { MODULE_FIELD_KEY_ENUM } from '@/domain/module/enum/module-field-key.enum';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { AddDemoDataUseCase } from '@/domain/module/use-case/add-demo-data.use-case';
import { mockModuleFieldEntity, mockRecordEntity } from '@/tests/mocks';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';
import {
  mockModuleFieldPort,
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks/module-field.port.mock';

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
      expect(recordAdapter.upsert).not.toHaveBeenCalled();
    });

    it('creates records and associates record fields via batchUpsert', async () => {
      const {
        useCase,
        carerAdapter,
        moduleAdapter,
        moduleFieldAdapter,
        recordAdapter,
        recordFieldAdapter,
      } = prepareSuiteCase();

      const primaryCarer = mockCarerEntity();
      carerAdapter.getAll.mockResolvedValue([primaryCarer]);

      moduleAdapter.getAll.mockResolvedValue([
        mockModuleEntity({ isActive: true, id: 10 }),
      ]);

      moduleFieldAdapter.getAllByModuleId.mockResolvedValue([
        mockModuleFieldEntity({
          id: 100,
          values: '',
          code: MODULE_FIELD_KEY_ENUM.COLOR,
        }),
      ]);

      recordAdapter.upsert.mockResolvedValue(mockRecordEntity({ id: 999 }));
      recordFieldAdapter.batchUpsert.mockResolvedValue([]);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(recordAdapter.upsert).toHaveBeenCalled();
      expect(recordFieldAdapter.batchUpsert).toHaveBeenCalled();

      const [[calledRecordID]] = recordFieldAdapter.batchUpsert.mock.calls;
      expect(calledRecordID).toBe(999);
    });

    it('generates records with unique seconds for each entry in a day', async () => {
      const {
        useCase,
        carerAdapter,
        moduleAdapter,
        moduleFieldAdapter,
        recordAdapter,
      } = prepareSuiteCase();

      carerAdapter.getAll.mockResolvedValue([mockCarerEntity()]);
      moduleAdapter.getAll.mockResolvedValue([
        mockModuleEntity({ isActive: true }),
      ]);
      moduleFieldAdapter.getAllByModuleId.mockResolvedValue([]);
      recordAdapter.upsert.mockResolvedValue({ id: 999 });

      (useCase as unknown as { DAYS_TO_CREATE?: number }).DAYS_TO_CREATE = 1;

      await useCase.execute();

      // Get all createdAt dates from upsert calls
      const createdDates = recordAdapter.upsert.mock.calls.map(
        (call) => call[0].createdAt
      );

      // Check if all dates are unique by second
      const seconds = createdDates.map((d) => d.getSeconds());
      const uniqueSeconds = new Set(seconds);

      expect(uniqueSeconds.size).toBe(createdDates.length);
    });

    it('generates demo values for SELECT fields with valid JSON', async () => {
      const {
        useCase,
        carerAdapter,
        moduleAdapter,
        moduleFieldAdapter,
        recordAdapter,
        recordFieldAdapter,
      } = prepareSuiteCase();

      carerAdapter.getAll.mockResolvedValue([mockCarerEntity()]);
      moduleAdapter.getAll.mockResolvedValue([
        mockModuleEntity({ isActive: true }),
      ]);

      moduleFieldAdapter.getAllByModuleId.mockResolvedValue([
        mockModuleFieldEntity({
          type: MODULE_FIELD_TYPE_ENUM.SELECT,
          values: '["option1", "option2", "option3"]',
        }),
      ]);

      recordAdapter.upsert.mockResolvedValue(mockRecordEntity());
      recordFieldAdapter.batchUpsert.mockResolvedValue([]);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(recordFieldAdapter.batchUpsert).toHaveBeenCalled();

      const [, recordFields] = recordFieldAdapter.batchUpsert.mock.calls[0];
      expect(recordFields).toHaveLength(1);
      expect(['option1', 'option2', 'option3']).toContain(
        recordFields[0].value
      );
    });

    it('generates demo values for SELECT fields with invalid JSON', async () => {
      const {
        useCase,
        carerAdapter,
        moduleAdapter,
        moduleFieldAdapter,
        recordAdapter,
        recordFieldAdapter,
      } = prepareSuiteCase();

      carerAdapter.getAll.mockResolvedValue([mockCarerEntity()]);
      moduleAdapter.getAll.mockResolvedValue([
        mockModuleEntity({ isActive: true }),
      ]);

      moduleFieldAdapter.getAllByModuleId.mockResolvedValue([
        mockModuleFieldEntity({
          type: MODULE_FIELD_TYPE_ENUM.SELECT,
          values: 'invalid json',
        }),
      ]);

      recordAdapter.upsert.mockResolvedValue(mockRecordEntity());
      recordFieldAdapter.batchUpsert.mockResolvedValue([]);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      expect(recordFieldAdapter.batchUpsert).toHaveBeenCalled();

      const [, recordFields] = recordFieldAdapter.batchUpsert.mock.calls[0];
      expect(recordFields).toHaveLength(1);
      expect(recordFields[0].value).toBe('Demo select value');
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
