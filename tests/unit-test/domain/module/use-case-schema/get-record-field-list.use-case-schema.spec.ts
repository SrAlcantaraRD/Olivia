/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import type {
  TRequestGetRecordFieldList,
  TResponseGetRecordFieldList,
} from '@/domain/module/use-case-schema/get-record-field-list.use-case-schema';

describe('[UseCaseSchema] - GetRecordFieldList', () => {
  describe('TRequestGetRecordFieldList', () => {
    it('should have fieldId as required property', () => {
      const request: TRequestGetRecordFieldList = { fieldId: 1 };
      expect(request.fieldId).toBe(1);
    });
  });

  describe('TResponseGetRecordFieldList', () => {
    it('should be an array of TRecordField', () => {
      const response: TResponseGetRecordFieldList = [];
      expect(Array.isArray(response)).toBe(true);
    });

    it('should support RecordField objects in array', () => {
      const response: TResponseGetRecordFieldList = [
        {
          id: 1,
          recordID: 1,
          fieldID: 1,
          value: 'test-value',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          status: 1,
        },
      ];
      expect(response.length).toBe(1);
      expect(response[0].value).toBe('test-value');
    });
  });
});
