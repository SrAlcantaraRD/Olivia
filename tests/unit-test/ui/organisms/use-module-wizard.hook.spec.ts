import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useModuleWizard } from '@/ui/components/organisms/module-wizard/use-module-wizard.hook';
import {
  mockModuleEntity,
  mockModuleFieldEntity,
} from '../../domain/module/mocks/mock.entities';

const mockField = mockModuleFieldEntity({ required: true });

jest.mock('@/domain/module/use-case/get-module-field-list.use-case', () => ({
  GetModuleFieldListUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({
      success: true,
      details: { items: [mockField] },
    }),
  })),
}));

jest.mock('@/domain/module/hook/get-list-module-field.hook', () => ({
  useGetListModuleField: jest.fn(() => ({
    execute: jest.fn(),
    items: [mockField],
  })),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({})),
}));

jest.mock('drizzle-orm/expo-sqlite', () => ({
  drizzle: jest.fn(() => ({
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          all: jest.fn(() => []),
        })),
      })),
    })),
  })),
}));

jest.mock('@/database/config/database.config', () => ({
  DB_CLIENT: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          all: jest.fn(() => []),
        })),
      })),
    })),
  },
  SQLITE_DB: {},
  buildAdapterClient: jest.fn(),
}));

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
