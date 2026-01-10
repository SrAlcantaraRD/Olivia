import { describe, expect, it } from '@jest/globals';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

describe('[Error] - CannotParseSchema', () => {
  describe('ErrorCannotParseSchema class', () => {
    it('should create error with correct properties', () => {
      const schemaName = 'TestSchema';
      const message = 'Invalid value provided';

      const error = new ErrorCannotParseSchema(schemaName, message);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ErrorCannotParseSchema);
      expect(error.name).toBe('CANNOT_PARSE_SCHEMA');
      expect(error.code).toBe(`Error when parsing schema "${schemaName}"`);
      expect(error.message).toBe(message);
    });

    it('should include custom message in error details', () => {
      const schemaName = 'UserSchema';
      const customMessage = 'Field "email" is required';

      const error = new ErrorCannotParseSchema(schemaName, customMessage);

      expect(error.code).toContain(schemaName);
      expect(error.code).toContain('Error when parsing schema');
      expect(error.message).toBe(customMessage);
    });

    it('should have proper inheritance from Error', () => {
      const error = new ErrorCannotParseSchema('Test', 'Test message');

      expect(error instanceof Error).toBe(true);
      expect(error.stack).toBeDefined();
      expect(typeof error.toString).toBe('function');
    });
  });
});
