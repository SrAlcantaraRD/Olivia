import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { useModuleWizard } from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';

describe('[Hook] useModuleWizard', () => {
  it('creates steps from module field and handles select option navigation', () => {
    const mockField = {
      id: 1,
      moduleId: 1,
      title: 'page.cic_register.volume.title',
      description: 'page.cic_register.volume.description',
      type: MODULE_FIELD_TYPE_ENUM.SELECT,
      values:
        '["page.cic_register.volume.low","page.cic_register.volume.normal","page.cic_register.volume.high"]',
      required: true,
      order: 1,
      status: STATUS_ENUM.ACTIVE,
    } satisfies TModuleField;

    const mockModule = {
      id: 1,
      code: MODULE_KEY_ENUM.CIC,
      name: 'CIC',
      description: 'Catheterization',
      isActive: true,
      fieldList: [mockField],
      status: STATUS_ENUM.ACTIVE,
    } satisfies TModule;

    const { result } = renderHook(() =>
      useModuleWizard({ module: mockModule })
    );

    expect(result.current.fieldList.length).toBe(1);
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
