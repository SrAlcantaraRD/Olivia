import { describe, expect, it } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockModuleFieldPort } from '@/tests/mocks/module-field.port.mock';
import { useModuleWizard } from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';

describe('[Hook] useModuleWizard', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const notifyAdapter = mockNotifyPort();
    const moduleFieldAdapter = mockModuleFieldPort();

    return { loggerAdapter, notifyAdapter, moduleFieldAdapter };
  };

  it('creates steps from module field and handles select option navigation', async () => {
    const { loggerAdapter, notifyAdapter, moduleFieldAdapter } =
      prepareSuiteCase();
    const mockField = mockModuleFieldEntity({ required: true });

    const mockModule = mockModuleEntity({
      fieldList: [mockField],
    });

    moduleFieldAdapter.getAllByModuleId.mockResolvedValue([mockField]);

    const { result } = renderHook(() =>
      useModuleWizard({
        moduleID: mockModule.id,
        initialValues: {},
        adapters: {
          loggerAdapter,
          notifyAdapter,
          moduleFieldAdapter,
        },
      })
    );

    await waitFor(() => {
      expect(result.current.fieldList.length).toBe(1);
    });
    expect(result.current.currentStep).toBe(0);
    expect(result.current.steps[0].isValid).toBe(false);

    act(() => {
      result.current.selectOptionAndNext(1, 'page.cic_register.volume.normal');
    });

    expect(result.current.values[1]).toBe('page.cic_register.volume.normal');
    // should have navigated to next step but since only one step, remain at last index 0
    expect(result.current.currentStep).toBe(0);
  });
});
