/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetModuleListByIDListUseCase } from '@/domain/module/use-case/get-module-list-by-id-list.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModulePort } from '@/tests/mocks/module.port.mock';

describe('[UseCase] - GetModuleListByIDList', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const moduleAdapter = mockModulePort();

    const useCase = new GetModuleListByIDListUseCase({
      loggerAdapter,
      moduleAdapter,
    });

    return { useCase, loggerAdapter, moduleAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('filters modules by the provided id list and logs the details', async () => {
    const { useCase, moduleAdapter, loggerAdapter } = prepareSuiteCase();
    const firstModule = mockModuleEntity({ id: 1 });
    const secondModule = mockModuleEntity({ id: 2 });
    const modules = [firstModule, secondModule];
    moduleAdapter.getAll.mockResolvedValue(modules);

    const response = await useCase.execute({ idList: [secondModule.id] });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    const expectedTargetList = [secondModule];
    expect(response.details.items).toEqual(expectedTargetList);
    expect(loggerAdapter.error).toHaveBeenCalledWith({
      list: modules,
      idList: [secondModule.id],
      targetList: expectedTargetList,
    });
  });
});
