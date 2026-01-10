/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestAddDemoDataSchema,
  ResponseAddDemoDataSchema,
} from '@/domain/module/use-case-schema/add-demo-data.use-case-schema';

describe('[UseCaseSchema] - AddDemoData', () => {
  describe('RequestAddDemoDataSchema', () => {
    it('should parse void request', () => {
      const result = RequestAddDemoDataSchema.parse(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('ResponseAddDemoDataSchema', () => {
    it('should parse void response', () => {
      const result = ResponseAddDemoDataSchema.parse(undefined);
      expect(result).toBeUndefined();
    });
  });
});
