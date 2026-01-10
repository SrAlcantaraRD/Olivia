import { GetRecordFieldListUseCase } from '@/domain/module/use-case/get-record-field-list.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockRecordFieldPort } from '@/tests/mocks/module-field.port.mock';

describe('GetRecordFieldListUseCase', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const recordFieldAdapter = mockRecordFieldPort();

    const useCase = new GetRecordFieldListUseCase({
      loggerAdapter,
      recordFieldAdapter,
    });

    return { useCase, loggerAdapter, recordFieldAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('should return records when port call is successful', async () => {
    const { useCase, recordFieldAdapter } = prepareSuiteCase();

    const mockRecords = [
      { id: 1, fieldId: 10, value: 'Value 1', createdAt: new Date() },
      { id: 2, fieldId: 10, value: 'Value 2', createdAt: new Date() },
    ];
    recordFieldAdapter.getAllByFieldID.mockResolvedValue(mockRecords);

    const response = await useCase.execute({ fieldId: 10 });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details).toEqual(mockRecords);
    expect(recordFieldAdapter.getAllByFieldID).toHaveBeenCalledWith(10);
  });

  it('should return error response when port call fails', async () => {
    const { useCase, loggerAdapter, recordFieldAdapter } = prepareSuiteCase();
    const error = new Error('DB Error');
    recordFieldAdapter.getAllByFieldID.mockRejectedValue(error);

    const response = await useCase.execute({ fieldId: 10 });

    expect(response.success).toBe(false);
    expect(response.message).toBe('common.error');
    expect(loggerAdapter.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error fetching record fields',
        error,
      })
    );
  });
});
