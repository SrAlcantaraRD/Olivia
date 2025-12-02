import { describe, expect, it } from '@jest/globals';

import { moduleFieldMapper } from '@/domain/module/mapper/module-field.mapper';
import { mockModuleFieldEntity } from '../mocks/mock.entities';

describe('[Mapper] - ModuleField', () => {
  it('moduleFieldMapper.toDTO maps base fields excluding id', () => {
    const entity = mockModuleFieldEntity({ uuid: 'mf-1', title: 'Field X' });

    const dto = moduleFieldMapper.toDTO(entity);

    expect('id' in dto).toBe(false);
    expect(dto.uuid).toBe('mf-1');
    expect(dto.title).toBe('Field X');
  });
});
