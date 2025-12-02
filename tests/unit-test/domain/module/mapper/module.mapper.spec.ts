import { describe, expect, it } from '@jest/globals';

import { moduleMapper } from '@/domain/module/mapper/module.mapper';
import { mockModuleEntity } from '../__test__/mock.entities';

describe('[Mapper] - Module', () => {
  it('moduleMapper.toDTO maps base fields excluding id', () => {
    const entity = mockModuleEntity({ uuid: 'm-1', name: 'Module A' });

    const dto = moduleMapper.toDTO(entity);

    expect('id' in dto).toBe(false);
    expect(dto.uuid).toBe('m-1');
    expect(dto.name).toBe('Module A');
  });
});
