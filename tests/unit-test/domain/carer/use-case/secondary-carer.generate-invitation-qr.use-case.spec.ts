/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { SecondaryCarerGenerateInvitationQRUseCase } from '@/domain/carer/use-case/secondary-carer.generate-invitation-qr.use-case';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { TIME_TO_LIVE } from '@/domain/core/enum/time-to-live.enum';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/error-entity-not-found-by.error';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import {
  mockCachePort,
  mockLoggerPort,
  mockQRPort,
} from '@/tests/mocks/core.port.mock';
import { mockInviteSecondaryCarerQR } from '@/tests/mocks/invite-secondary-carer.qr.dto.mock';
import { mockModule } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockQRBundle } from '@/tests/mocks/qr.dto.mock';

describe('[UseCase] - SecondaryCarerGenerateInvitationQR', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const qrAdapter = mockQRPort();
    const cacheAdapter = mockCachePort();
    const moduleAdapter = mockModulePort();

    const useCase = new SecondaryCarerGenerateInvitationQRUseCase({
      loggerAdapter,
      carerAdapter,
      qrAdapter,
      cacheAdapter,
      moduleAdapter,
    });

    return {
      useCase,
      loggerAdapter,
      carerAdapter,
      qrAdapter,
      cacheAdapter,
      moduleAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should generate QR invitation successfully', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 'test-carer-id';
      const timeToLive = TIME_TO_LIVE.ONE_WEEK;
      const carer = mockCarerEntity({ id: carerID, name: 'Test Carer' });
      const modules = [
        mockModule({
          id: 1,
          moduleFieldList: [
            mockModuleFieldEntity({ id: 1, status: STATUS_ENUM.ACTIVE }),
            mockModuleFieldEntity({ id: 2, status: STATUS_ENUM.INACTIVE }),
          ],
        }),
        mockModule({
          id: 2,
          moduleFieldList: [
            mockModuleFieldEntity({ id: 3, status: STATUS_ENUM.ACTIVE }),
          ],
        }),
      ];
      const qrData = mockInviteSecondaryCarerQR();
      const qrBundle = mockQRBundle();

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      qrAdapter.generateQRCode.mockReturnValue(qrData);
      qrAdapter.packBundle.mockResolvedValue(qrBundle);

      const response = await useCase.execute({ carerID, timeToLive });

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
      expect(response.details).toEqual({
        qrBundle,
        qrData,
      });

      expect(carerAdapter.getByID).toHaveBeenCalledWith(carerID);
      expect(moduleAdapter.getAll).toHaveBeenCalled();

      const expectedPayload = {
        originCarerId: carer.id,
        originCarerName: carer.name,
        originCarerExpiresAt: expect.any(Date),
        moduleList: [
          {
            moduleId: 1,
            moduleFieldList: [1],
          },
          {
            moduleId: 2,
            moduleFieldList: [3],
          },
        ],
      };

      expect(qrAdapter.generateQRCode).toHaveBeenCalledWith(expectedPayload);
      expect(qrAdapter.packBundle).toHaveBeenCalledWith(qrData);
    });

    it('should calculate correct expiration date for different time-to-live values', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 'test-carer-id';
      const carer = mockCarerEntity({ id: carerID });
      const modules = [mockModule({ id: 1, moduleFieldList: [] })];
      const qrData = mockInviteSecondaryCarerQR();
      const qrBundle = mockQRBundle();

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      qrAdapter.generateQRCode.mockReturnValue(qrData);
      qrAdapter.packBundle.mockResolvedValue(qrBundle);

      // Test ONE_DAY
      await useCase.execute({ carerID, timeToLive: TIME_TO_LIVE.ONE_DAY });
      expect(qrAdapter.generateQRCode).toHaveBeenCalledWith(
        expect.objectContaining({
          originCarerExpiresAt: expect.any(Date),
        })
      );

      // Reset mocks
      qrAdapter.generateQRCode.mockClear();

      // Test ONE_WEEK
      await useCase.execute({ carerID, timeToLive: TIME_TO_LIVE.ONE_WEEK });
      expect(qrAdapter.generateQRCode).toHaveBeenCalledWith(
        expect.objectContaining({
          originCarerExpiresAt: expect.any(Date),
        })
      );

      // Reset mocks
      qrAdapter.generateQRCode.mockClear();

      // Test ONE_MONTH
      await useCase.execute({ carerID, timeToLive: TIME_TO_LIVE.ONE_MONTH });
      expect(qrAdapter.generateQRCode).toHaveBeenCalledWith(
        expect.objectContaining({
          originCarerExpiresAt: expect.any(Date),
        })
      );
    });
  });

  describe('Negative Path', () => {
    it('should throw error when carer is not found', async () => {
      const { useCase, carerAdapter } = prepareSuiteCase();

      const carerID = 'non-existent-carer-id';
      carerAdapter.getByID.mockResolvedValue(null);

      await expect(
        useCase.execute({ carerID, timeToLive: TIME_TO_LIVE.ONE_DAY })
      ).rejects.toThrow(ErrorEntityNotFoundBy);

      expect(carerAdapter.getByID).toHaveBeenCalledWith(carerID);
    });

    it('should return error when request validation fails', async () => {
      const { useCase } = prepareSuiteCase();

      const response = await useCase.execute({
        carerID: '',
        timeToLive: 'INVALID_TIME' as any,
      });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.generate-invitation-qr-for-secondary-carer.invalid-request'
      );
    });

    it('should return error when QR generation fails', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 'test-carer-id';
      const carer = mockCarerEntity({ id: carerID });
      const modules = [mockModule({ id: 1, moduleFieldList: [] })];

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      qrAdapter.generateQRCode.mockImplementation(() => {
        throw new Error('QR generation failed');
      });

      const response = await useCase.execute({
        carerID,
        timeToLive: TIME_TO_LIVE.ONE_DAY,
      });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.generate-invitation-qr-for-secondary-carer.generation-failed'
      );

      expect(carerAdapter.getByID).toHaveBeenCalledWith(carerID);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
      expect(qrAdapter.generateQRCode).toHaveBeenCalled();
    });

    it('should return error when bundle packing fails', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 'test-carer-id';
      const carer = mockCarerEntity({ id: carerID });
      const modules = [mockModule({ id: 1, moduleFieldList: [] })];
      const qrData = mockInviteSecondaryCarerQR();

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      qrAdapter.generateQRCode.mockReturnValue(qrData);
      qrAdapter.packBundle.mockRejectedValue(new Error('Packing failed'));

      const response = await useCase.execute({
        carerID,
        timeToLive: TIME_TO_LIVE.ONE_DAY,
      });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.generate-invitation-qr-for-secondary-carer.generation-failed'
      );

      expect(carerAdapter.getByID).toHaveBeenCalledWith(carerID);
      expect(moduleAdapter.getAll).toHaveBeenCalled();
      expect(qrAdapter.generateQRCode).toHaveBeenCalled();
      expect(qrAdapter.packBundle).toHaveBeenCalledWith(qrData);
    });
  });
});
