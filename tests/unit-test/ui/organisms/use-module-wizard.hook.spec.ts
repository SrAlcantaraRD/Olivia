import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import { useModuleWizard } from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';
import {
  mockModuleEntity,
  mockModuleFieldEntity,
} from '../../domain/module/mocks/mock.entities';

describe('[Hook] useModuleWizard', () => {
  it('creates steps from module field and handles select option navigation', () => {
    const mockField = mockModuleFieldEntity();

    const mockModule = mockModuleEntity({
      fieldList: [mockField],
    });

    const { result } = renderHook(() =>
      useModuleWizard({ moduleID: mockModule.id, initialValues: {} })
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
