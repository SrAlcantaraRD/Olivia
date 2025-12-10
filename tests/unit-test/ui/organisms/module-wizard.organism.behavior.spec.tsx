import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';

describe('[Organism] ModuleWizard behavior', () => {
  it('calls onComplete when selecting last option of a single-select module', async () => {
    const mockField = {
      id: 1,
      createdAt: new Date().toISOString(),
      moduleId: 1,
      title: 'page.cic_register.volume.title',
      description: 'page.cic_register.volume.description',
      type: MODULE_FIELD_TYPE_ENUM.SELECT,
      values:
        '["page.cic_register.volume.low","page.cic_register.volume.normal","page.cic_register.volume.high"]',
      required: true,
      order: 1,
      status: 1,
      module: {} as unknown as TModule,
    } as unknown as TModuleField;

    const module: TModule = {
      id: 1,
      code: MODULE_KEY_ENUM.CIC,
      name: 'CIC',
      description: 'Catheterization',
      isActive: true,
      fieldList: [mockField],
      status: 1,
    } as unknown as TModule;

    const onComplete = jest.fn();

    const { findByTestId } = render(
      <ModuleWizard
        module={module}
        testID="test.module-wizard"
        onComplete={onComplete}
      />
    );

    const optionTestId =
      'test.module-wizard.field.1.option.page.cic_register.volume.normal.card';

    const option = await findByTestId(optionTestId);
    fireEvent.press(option);

    // Wait a minimal time for the hook to set value and call onNext
    await new Promise((res) => setTimeout(res, 300));

    expect(onComplete).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith({
      1: 'page.cic_register.volume.normal',
    });
  });
});
