/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { SecondaryCarerConsumeInvitationQRUseCase } from '@/domain/carer/use-case/secondary-carer.consume-invitation-qr.use-case';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
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
import { mockModule } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';
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
      const qrData = mockInviteSecondaryCarerQR();
      const payload = mockInviteSecondaryCarerQRPayload();
      const newCarer = mockCarerEntity({
        id: 'new-carer-id',
        name: payload.originCarerName,
        isPrimary: false,
      });
      const modules = [
        mockModule({
          id: 1,
          moduleFieldList: [
            mockModuleFieldEntity({ id: 1, status: STATUS_ENUM.ACTIVE }),
            mockModuleFieldEntity({ id: 2, status: STATUS_ENUM.INACTIVE }),
          ],
        }),
      ];

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByName.mockResolvedValue(null);
      carerAdapter.create.mockResolvedValue(newCarer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      moduleFieldAdapter.batchActivate.mockResolvedValue(undefined);
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
      expect(response.details).toEqual({
        carer: newCarer,
        activatedModules: [1],
      });

      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
      expect(carerAdapter.getByName).toHaveBeenCalledWith(
        payload.originCarerName
      );
      expect(carerAdapter.create).toHaveBeenCalledWith({
        name: payload.originCarerName,
        isPrimary: false,
        pinHash: null,
        type: 'secondary',
      });
      expect(moduleAdapter.getAll).toHaveBeenCalled();
      expect(moduleFieldAdapter.batchActivate).toHaveBeenCalledWith(
        'new-carer-id',
        [1],
        [1]
      );
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        'secondary-carer:new-carer-id',
        { carer: newCarer, activatedModules: [1] }
      );
    });

    it('should consume QR invitation successfully for existing carer', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        cacheAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const qrData = mockInviteSecondaryCarerQR();
      const payload = mockInviteSecondaryCarerQRPayload();
      const existingCarer = mockCarerEntity({
        id: 'existing-carer-id',
        name: payload.originCarerName,
        isPrimary: false,
      });
      const modules = [
        mockModule({
          id: 1,
          moduleFieldList: [
            mockModuleFieldEntity({ id: 1, status: STATUS_ENUM.ACTIVE }),
          ],
        }),
      ];

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByName.mockResolvedValue(existingCarer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      moduleFieldAdapter.batchActivate.mockResolvedValue(undefined);
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
      expect(response.details).toEqual({
        carer: existingCarer,
        activatedModules: [1],
      });

      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
      expect(carerAdapter.getByName).toHaveBeenCalledWith(
        payload.originCarerName
      );
      expect(carerAdapter.create).not.toHaveBeenCalled();
      expect(moduleAdapter.getAll).toHaveBeenCalled();
      expect(moduleFieldAdapter.batchActivate).toHaveBeenCalledWith(
        'existing-carer-id',
        [1],
        [1]
      );
      expect(cacheAdapter.set).toHaveBeenCalledWith(
        'secondary-carer:existing-carer-id',
        { carer: existingCarer, activatedModules: [1] }
      );
    });
  });

  describe('Negative Path', () => {
    it('should return error when QR bundle unpacking fails', async () => {
      const { useCase, qrAdapter } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      qrAdapter.unpackBundle.mockRejectedValue(new Error('Invalid bundle'));

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.consume-invitation-qr-for-secondary-carer.unpack-failed'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
    });

    it('should return error when QR payload is invalid', async () => {
      const { useCase, qrAdapter } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const invalidQRData = mockQR({
        payload: { invalid: 'payload' },
      });

      qrAdapter.unpackBundle.mockResolvedValue(invalidQRData);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.consume-invitation-qr-for-secondary-carer.invalid-payload'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
    });

    it('should return error when QR has expired', async () => {
      const { useCase, qrAdapter } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const expiredQRData = mockInviteSecondaryCarerQR({
        payload: mockInviteSecondaryCarerQRPayload({
          originCarerExpiresAt: new Date('2020-01-01'), // Past date
        }),
      });

      qrAdapter.unpackBundle.mockResolvedValue(expiredQRData);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.consume-invitation-qr-for-secondary-carer.expired'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
    });

    it('should return error when carer creation fails', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const qrData = mockInviteSecondaryCarerQR();
      const payload = mockInviteSecondaryCarerQRPayload();

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByName.mockResolvedValue(null);
      carerAdapter.create.mockRejectedValue(new Error('DB error'));
      moduleAdapter.getAll.mockResolvedValue([]);
      moduleFieldAdapter.batchActivate.mockResolvedValue(undefined);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.consume-invitation-qr-for-secondary-carer.creation-failed'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
      expect(carerAdapter.getByName).toHaveBeenCalledWith(
        payload.originCarerName
      );
      expect(carerAdapter.create).toHaveBeenCalled();
    });

    it('should return error when module activation fails', async () => {
      const {
        useCase,
        carerAdapter,
        qrAdapter,
        cacheAdapter,
        moduleAdapter,
        moduleFieldAdapter,
      } = prepareSuiteCase();

      const qrBundle = mockQRBundle();
      const qrData = mockInviteSecondaryCarerQR();
      const payload = mockInviteSecondaryCarerQRPayload();
      const newCarer = mockCarerEntity({
        id: 'new-carer-id',
        name: payload.originCarerName,
        isPrimary: false,
      });
      const modules = [mockModule({ id: 1 })];

      qrAdapter.unpackBundle.mockResolvedValue(qrData);
      carerAdapter.getByName.mockResolvedValue(null);
      carerAdapter.create.mockResolvedValue(newCarer);
      moduleAdapter.getAll.mockResolvedValue(modules);
      moduleFieldAdapter.batchActivate.mockRejectedValue(
        new Error('Activation failed')
      );
      cacheAdapter.set.mockResolvedValue(undefined);

      const response = await useCase.execute({ qrBundle });

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.consume-invitation-qr-for-secondary-carer.activation-failed'
      );
      expect(qrAdapter.unpackBundle).toHaveBeenCalledWith(qrBundle);
      expect(carerAdapter.getByName).toHaveBeenCalledWith(
        payload.originCarerName
      );
      expect(carerAdapter.create).toHaveBeenCalled();
      expect(moduleFieldAdapter.batchActivate).toHaveBeenCalled();
      expect(cacheAdapter.set).not.toHaveBeenCalled();
    });
  });
});
