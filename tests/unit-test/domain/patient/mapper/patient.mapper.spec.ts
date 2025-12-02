import { describe, expect, it } from '@jest/globals';

import { patientMapper } from '@/domain/patient/mapper/patient.mapper';
import { mockPatientEntity } from '../__test__/mock.entities';

describe('[Mapper] - Patient', () => {
  it('patientEntityToDTO maps base fields excluding id', () => {
    const entity = mockPatientEntity({
      uuid: 'u-1',
      name: 'Alice',
    });

    const dto = patientMapper.toDTO(entity);

    expect('id' in dto).toBe(false);
    expect(dto.uuid).toBe('u-1');
    expect(dto.name).toBe('Alice');
  });
});
