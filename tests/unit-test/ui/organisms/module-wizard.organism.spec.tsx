import { describe, expect, it } from '@jest/globals';

import { parseFieldValues } from '@/ui/components/organisms/module-wizard/module-wizard.organism';

describe('[Organism] - ModuleWizard parseFieldValues', () => {
  it('parses JSON array string into array', () => {
    const values = '["option.one","option.two"]';
    const result = parseFieldValues(values);
    expect(result).toEqual(['option.one', 'option.two']);
  });

  it('returns empty array for invalid JSON values', () => {
    const values = 'option.one, option.two,option.three';
    const result = parseFieldValues(values);
    expect(result).toEqual([]);
  });

  it('returns empty array for empty values', () => {
    expect(parseFieldValues(undefined)).toEqual([]);
    expect(parseFieldValues('')).toEqual([]);
  });
});
