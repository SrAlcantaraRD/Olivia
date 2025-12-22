import { describe, expect, it } from '@jest/globals';

import type { TModule } from '@/domain/module/entity/module.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { mockLoggerPort, mockNotifyPort } from '@/tests/mocks/core.port.mock';
import { mockModuleFieldEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockModuleFieldPort } from '@/tests/mocks/module-field.port.mock';
import { mockModuleEntity } from '@/tests/mocks/module.entity.mock';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';
import { act, render, userEvent, waitFor } from '../test-utils';

describe('[UI] ModuleWizard behavior', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const notifyAdapter = mockNotifyPort();
    const moduleFieldAdapter = mockModuleFieldPort({
      getAllByModuleId: jest.fn().mockResolvedValue([
        mockModuleFieldEntity({
          id: 1,
          moduleId: 1,
          type: MODULE_FIELD_TYPE_ENUM.SELECT,
          values: JSON.stringify(['page.cic_register.volume.normal']),
        }),
      ]),
    });

    return { loggerAdapter, notifyAdapter, moduleFieldAdapter };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onComplete when selecting last option of a single-select module', async () => {
    jest.useFakeTimers();

    const module: TModule = mockModuleEntity();
    const { loggerAdapter, notifyAdapter, moduleFieldAdapter } =
      prepareSuiteCase();

    const onComplete = jest.fn();

    const { findByTestId } = render(
      <ModuleWizard
        moduleID={module.id}
        testID="test.module-wizard"
        onComplete={onComplete}
        adapters={{ loggerAdapter, notifyAdapter, moduleFieldAdapter }}
      />
    );

    const optionTestId =
      'test.module-wizard.field.1.option.page.cic_register.volume.normal.selectable-card.pressable';

    const option = await findByTestId(optionTestId);

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    await user.press(option);

    // useModuleWizard waits 500ms before calling onComplete
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
    expect(onComplete).toHaveBeenCalledWith({
      moduleID: 1,
      carerID: 0,
      data: '{"1":"page.cic_register.volume.normal"}',
      synced: false,
      fieldList: [{ fieldID: 1, value: 'page.cic_register.volume.normal' }],
      createdAt: expect.any(Date),
    });

    jest.useRealTimers();
  });
});
