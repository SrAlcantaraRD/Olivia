/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';
import { addDays, addMonths, addWeeks, endOfDay } from 'date-fns';

import type { TInviteSecondaryCarerQRPayload } from '@/domain/carer/dto/invite-secondary-carer.qr.dto';
import { SecondaryCarerGenerateInvitationQRUseCase } from '@/domain/carer/use-case/secondary-carer.generate-invitation-qr.use-case';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import type { TQR } from '@/domain/core/dto/qr.dto';
import { QR_BUNDLER_VERSION } from '@/domain/core/enum/qr.enum';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/entity-not-found-by.error';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import {
  mockCachePort,
  mockLoggerPort,
  mockQRPort,
} from '@/tests/mocks/core.port.mock';
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

  const getPackedPayload = (qrAdapter: ReturnType<typeof mockQRPort>) => {
    const [packedBundle] = qrAdapter.packBundle.mock.calls[0] as [
      TQR<TInviteSecondaryCarerQRPayload>,
    ];

    return packedBundle[QR_KEY.PAYLOAD];
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should generate QR invitation successfully', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 1;
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
      const qrBundle = mockQRBundle();

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      qrAdapter.packBundle.mockResolvedValue(qrBundle);

      const response = await useCase.execute({
        carerID,
        timeToLive: TIME_TO_LIVE.ONE_WEEK,
      });

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
      expect(response).toEqual(
        expect.objectContaining({
          details: expect.objectContaining({
            qrBundle,
            qrData: expect.objectContaining({
              [QR_KEY.METADATA]: {
                [QR_KEY.VERSION]: QR_BUNDLER_VERSION.V1,
              },
            }),
          }),
        })
      );

      expect(carerAdapter.getByID).toHaveBeenCalledWith(carerID);
      expect(moduleAdapter.getAll).toHaveBeenCalled();

      const payload = getPackedPayload(qrAdapter);

      expect(payload).toEqual({
        [QR_KEY.ORIGIN_CARER_ID]: carer.id,
        [QR_KEY.ORIGIN_CARER_NAME]: carer.name,
        [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: expect.any(Date),
        [QR_KEY.MODULE_LIST]: [
          { [QR_KEY.MODULE_ID]: 1, [QR_KEY.MODULE_FIELD_LIST]: [1] },
          { [QR_KEY.MODULE_ID]: 2, [QR_KEY.MODULE_FIELD_LIST]: [3] },
        ],
      });
    });

    it('should calculate correct expiration date for different time-to-live values', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 1;
      const carer = mockCarerEntity({ id: carerID });
      const modules = [mockModule({ id: 1, moduleFieldList: [] })];
      const qrBundle = mockQRBundle();

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      qrAdapter.packBundle.mockResolvedValue(qrBundle);

      const caseList: Array<{
        timeToLive: TIME_TO_LIVE;
        expected: Date;
      }> = [
        {
          timeToLive: TIME_TO_LIVE.ONE_DAY,
          expected: endOfDay(addDays(new Date(), 1)),
        },
        {
          timeToLive: TIME_TO_LIVE.ONE_WEEK,
          expected: endOfDay(addWeeks(new Date(), 1)),
        },
        {
          timeToLive: TIME_TO_LIVE.ONE_MONTH,
          expected: endOfDay(addMonths(new Date(), 1)),
        },
      ];

      for (const { timeToLive, expected } of caseList) {
        qrAdapter.packBundle.mockClear();

        await useCase.execute({ carerID, timeToLive });

        const payload = getPackedPayload(qrAdapter);
        const expiresAt = payload[QR_KEY.ORIGIN_CARER_EXPIRES_AT];

        // endOfDay pins hour/minute/second, so only the clock tick between the
        // use-case's `new Date()` and this assertion may differ.
        expect(Math.abs(expiresAt.getTime() - expected.getTime())).toBeLessThan(
          5000
        );
      }
    });
  });

  describe('Negative Path', () => {
    it('should throw error when carer is not found', async () => {
      const { useCase, carerAdapter } = prepareSuiteCase();

      const carerID = 999;
      carerAdapter.getByID.mockResolvedValue(null);

      await expect(
        useCase.execute({ carerID, timeToLive: TIME_TO_LIVE.ONE_DAY })
      ).rejects.toThrow(ErrorEntityNotFoundBy);

      expect(carerAdapter.getByID).toHaveBeenCalledWith(carerID);
    });

    it('should return error when request validation fails', async () => {
      const { useCase } = prepareSuiteCase();

      const response = await useCase.execute({
        carerID: 0,
        timeToLive: TIME_TO_LIVE.ONE_DAY,
      });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.generate-invitation-qr-for-secondary-carer.invalid-request'
      );
    });

    it('should return error when bundle packing fails', async () => {
      const { useCase, carerAdapter, qrAdapter, moduleAdapter } =
        prepareSuiteCase();

      const carerID = 1;
      const carer = mockCarerEntity({ id: carerID });
      const modules = [mockModule({ id: 1, moduleFieldList: [] })];

      carerAdapter.getByID.mockResolvedValue(carer);
      moduleAdapter.getAll.mockResolvedValue(modules);
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
      expect(qrAdapter.packBundle).toHaveBeenCalled();
    });
  });
});
