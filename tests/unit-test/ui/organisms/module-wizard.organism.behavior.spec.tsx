import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import type { TModule } from '@/domain/module/entity/module.entity';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';
import {
  mockLoggerPort,
  mockNotifyPort,
} from '../../domain/core/mocks/mock.port';
import {
  mockModuleEntity,
  mockModuleFieldEntity,
} from '../../domain/module/mocks/mock.entities';
import { mockModuleFieldPort } from '../../domain/module/mocks/mock.port';

const mockField = mockModuleFieldEntity({ required: true });

jest.mock('@/adapter', () => ({
  useAdapters: jest.fn(() => ({
    loggerAdapter: mockLoggerPort(),
    moduleFieldAdapter: mockModuleFieldPort({
      getAllByModuleId: jest.fn().mockResolvedValue([mockField]),
    }),
    notifyAdapter: mockNotifyPort(),
  })),
}));

describe('[Organism] ModuleWizard behavior', () => {
  it('calls onComplete when selecting last option of a single-select module', async () => {
    const module: TModule = mockModuleEntity();

    const onComplete = jest.fn();

    const { findByTestId } = render(
      <ModuleWizard
        moduleID={module.id}
        testID="test.module-wizard"
        onComplete={onComplete}
      />
    );

    const optionTestId =
      'test.module-wizard.field.1.option.page.cic_register.volume.normal.selectable-card';

    const option = await findByTestId(optionTestId);
    fireEvent.press(option);

    // Wait for the hook to set value and call goToNext
    await new Promise((res) => setTimeout(res, 600));

    expect(onComplete).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith({
      moduleID: 1,
      carerID: 0,
      data: '{"1":"page.cic_register.volume.normal"}',
      synced: false,
      fieldList: [{ fieldID: 1, value: 'page.cic_register.volume.normal' }],
    });
  });
});
