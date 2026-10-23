/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import { SecondaryCarerConsumeInvitationQRUseCase } from '@/domain/carer/use-case/secondary-carer.consume-invitation-qr.use-case';
import type { TRequestSecondaryCarerConsumeInvitation } from '@/domain/carer/use-case-schema/secondary-carer.consume-invitation-qr.use-case-schema';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';
import { mockCarerPort } from '@/tests/mocks/carer.port.mock';
import {
  mockCachePort,
  mockLoggerPort,
  mockQRPort,
} from '@/tests/mocks/core.port.mock';
import {
  mockInviteSecondaryCarerQR,
  mockInviteSecondaryCarerQRPayload,
} from '@/tests/mocks/invite-secondary-carer.qr.dto.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';
import { mockModuleFieldPort } from '@/tests/mocks/module-field.port.mock';
import { mockQR, mockQRBundle } from '@/tests/mocks/qr.dto.mock';

describe('[UseCase] - SecondaryCarerConsumeInvitationQR', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const carerAdapter = mockCarerPort();
    const qrAdapter = mockQRPort();
    const cacheAdapter = mockCachePort();
    const moduleAdapter = mockModulePort();
    const moduleFieldAdapter = mockModuleFieldPort();

    const useCase = new SecondaryCarerConsumeInvitationQRUseCase({
      loggerAdapter,
      carerAdapter,
      qrAdapter,
      cacheAdapter,
      moduleAdapter,
      moduleFieldAdapter,
    });

    return {
      useCase,
      loggerAdapter,
      carerAdapter,
      qrAdapter,
      cacheAdapter,
      moduleAdapter,
      moduleFieldAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should consume QR invitation successfully for new carer', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        cacheAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const payload = mockInviteSecondaryCarerQRPayload();
      const qrData = mockInviteSecondaryCarerQR({ [QR_KEY.PAYLOAD]: payload });
      const newCarer = mockCarerEntity({
        id: 2,
        name: payload[QR_KEY.ORIGIN_CARER_NAME],
        isPrimary: false,
      });

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByID.mockResolvedValue(null);
      moduleAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleAdapter.batchActivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchActivate.mockResolvedValue(undefined);
      carerAdapter.addSecondaryCarer.mockResolvedValue(newCarer);
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
      expect(response).toEqual(expect.objectContaining({ details: newCarer }));

      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
      expect(carerAdapter.getByID).toHaveBeenCalledWith(
        payload[QR_KEY.ORIGIN_CARER_ID]
      );

      const expectedModuleIDList = payload[QR_KEY.MODULE_LIST].map(
        (module) => module[QR_KEY.MODULE_ID]
      );
      const expectedFieldIDList = payload[QR_KEY.MODULE_LIST].flatMap(
        (module) => module[QR_KEY.MODULE_FIELD_LIST]
      );

      expect(moduleAdapter.batchDeactivate).toHaveBeenCalled();
      expect(moduleFieldAdapter.batchDeactivate).toHaveBeenCalled();
      expect(moduleAdapter.batchActivate).toHaveBeenCalledWith(
        expectedModuleIDList
      );
      expect(moduleFieldAdapter.batchActivate).toHaveBeenCalledWith(
        expectedFieldIDList
      );

      expect(carerAdapter.addSecondaryCarer).toHaveBeenCalledWith(
        payload[QR_KEY.ORIGIN_CARER_ID],
        {
          name: payload[QR_KEY.ORIGIN_CARER_NAME],
          type: CARER_TYPE_ENUM.SECONDARY,
          isPrimary: false,
          pinHash: '',
        }
      );

      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.SECONDARY_CARER_EXPIRES_AT,
        payload[QR_KEY.ORIGIN_CARER_EXPIRES_AT].getTime()
      );
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.CARER,
        newCarer.id
      );
    });

    it('should reuse existing carer and keep module activation', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        cacheAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const payload = mockInviteSecondaryCarerQRPayload();
      const qrData = mockInviteSecondaryCarerQR({ [QR_KEY.PAYLOAD]: payload });
      const existingCarer = mockCarerEntity({
        id: 3,
        name: payload[QR_KEY.ORIGIN_CARER_NAME],
        isPrimary: false,
      });

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByID.mockResolvedValue(existingCarer);
      moduleAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleAdapter.batchActivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchActivate.mockResolvedValue(undefined);
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(true);
      expect(response.message).toBe(
        'use-case.secondary-carer-consume-invitation-qr.carer-exists'
      );
      expect(response).toEqual(
        expect.objectContaining({ details: existingCarer })
      );

      expect(carerAdapter.addSecondaryCarer).not.toHaveBeenCalled();
      expect(moduleAdapter.batchActivate).toHaveBeenCalled();
      expect(moduleFieldAdapter.batchActivate).toHaveBeenCalled();
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        CACHE_KEY_ENUM.CARER,
        existingCarer.id
      );
    });
  });

  describe('Negative Path', () => {
    it('should return error when request validation fails', async () => {
      const { useCase } = prepareSuiteCase();

      const response = await useCase.execute(
        {} as unknown as TRequestSecondaryCarerConsumeInvitation
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.create-secondary-carer.invalid-request'
      );
    });

    it('should return error when QR payload is invalid', async () => {
      const { useCase, qrAdapter } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const invalidQRData = mockQR({ invalid: 'payload' });

      qrAdapter.unpackBundle.mockResolvedValue(invalidQRData);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.secondary-carer-consume-invitation-qr.invalid-qr-data'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
    });

    it('should propagate error when bundle unpacking fails', async () => {
      const { useCase, qrAdapter } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      qrAdapter.unpackBundle.mockRejectedValue(new Error('Invalid bundle'));

      await expect(useCase.execute({ qrBundle })).rejects.toThrow(
        'Invalid bundle'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
    });

    it('should propagate error when carer creation fails', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const payload = mockInviteSecondaryCarerQRPayload();
      const qrData = mockInviteSecondaryCarerQR({ [QR_KEY.PAYLOAD]: payload });

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByID.mockResolvedValue(null);
      moduleAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleAdapter.batchActivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchActivate.mockResolvedValue(undefined);
      carerAdapter.addSecondaryCarer.mockRejectedValue(new Error('DB error'));

      await expect(useCase.execute({ qrBundle })).rejects.toThrow('DB error');
      expect(carerAdapter.addSecondaryCarer).toHaveBeenCalled();
    });

    it('should propagate error when module activation fails', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        cacheAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const payload = mockInviteSecondaryCarerQRPayload();
      const qrData = mockInviteSecondaryCarerQR({ [QR_KEY.PAYLOAD]: payload });

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByID.mockResolvedValue(null);
      moduleAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchDeactivate.mockResolvedValue(undefined);
      moduleAdapter.batchActivate.mockResolvedValue(undefined);
      moduleFieldAdapter.batchActivate.mockRejectedValue(
        new Error('Activation failed')
      );

      await expect(useCase.execute({ qrBundle })).rejects.toThrow(
        'Activation failed'
      );
      expect(moduleFieldAdapter.batchActivate).toHaveBeenCalled();
      expect(cacheAdapter.set).not.toHaveBeenCalled();
      expect(carerAdapter.addSecondaryCarer).not.toHaveBeenCalled();
    });
  });
});
