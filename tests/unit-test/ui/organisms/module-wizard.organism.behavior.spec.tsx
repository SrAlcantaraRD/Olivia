import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import type { TModule } from '@/domain/module/entity/module.entity';
import { ModuleWizard } from '@/ui/components/organisms/module-wizard/module-wizard.organism';
import { mockModuleEntity } from '../../domain/module/mocks/mock.entities';

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
