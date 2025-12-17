import { CheckCarerExistenceUseCase } from '@/domain/carer/use-case/check-carer-existence.use-case';
import { mockLoggerPort } from '../../core/mocks/mock.port';
import { mockCarerPort } from '../mocks/mock.port';

describe('[UseCase] - CheckCarerExistence', () => {
  const prepareSuiteCase = () => {
    const carerPort = mockCarerPort();
    const loggerPort = mockLoggerPort();

    const useCase = new CheckCarerExistenceUseCase(loggerPort, carerPort);

    return { useCase, carerPort, loggerPort };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns exists true when carer exists', async () => {
      const { useCase, carerPort } = prepareSuiteCase();
      carerPort.existsAny.mockResolvedValue(true);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.details.exists).toBe(true);
      }
      expect(carerPort.existsAny).toHaveBeenCalledTimes(1);
    });

    it('returns exists false when no carer exists', async () => {
      const { useCase, carerPort } = prepareSuiteCase();
      carerPort.existsAny.mockResolvedValue(false);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.details.exists).toBe(false);
      }
      expect(carerPort.existsAny).toHaveBeenCalledTimes(1);
    });
  });

  describe('Negative Path', () => {
    it('throws error when port fails', async () => {
      const { useCase, carerPort } = prepareSuiteCase();
      carerPort.existsAny.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
      expect(carerPort.existsAny).toHaveBeenCalledTimes(1);
    });
  });
});
