import { describe, expect, it } from '@jest/globals';

import { carerMapper } from '@/domain/carer/mapper/carer.mapper';
import { mockCarerEntity } from '../mocks/mock.entities';

describe('[Mapper] - Carer', () => {
  it('carerMapper.toDTO maps base fields excluding id', () => {
    const entity = mockCarerEntity({ uuid: 'c-1', name: 'John' });

    const dto = carerMapper.toDTO(entity);

    expect('id' in dto).toBe(false);
    expect(dto.uuid).toBe('c-1');
    expect(dto.name).toBe('John');
  });
});
