import { describe, expect, it } from '@jest/globals';

import { ERROR_CODE_ENUM } from '@/domain/core/enum/error-code.enum';
import { ErrorDatabaseDefault } from '@/domain/core/error/database-default.error';

describe('[Error] - DatabaseDefault', () => {
  describe('ErrorDatabaseDefault class', () => {
    it('should create error with correct properties', () => {
      const code = 'DB_CONNECTION_FAILED';
      const description = 'Failed to connect to database';

      const error = new ErrorDatabaseDefault(code, description);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ErrorDatabaseDefault);
      expect(error.name).toBe(ERROR_CODE_ENUM.DEFAULT_ERROR);
      expect(error.code).toBe(code);
      expect(error.message).toBe(description);
    });

    it('should accept different error codes and descriptions', () => {
      const testCases = [
        { code: 'DB_TIMEOUT', description: 'Database operation timed out' },
        {
          code: 'DB_CONSTRAINT_VIOLATION',
          description: 'Unique constraint violated',
        },
        {
          code: 'DB_CONNECTION_LOST',
          description: 'Database connection was lost',
        },
      ];

      testCases.forEach(({ code, description }) => {
        const error = new ErrorDatabaseDefault(code, description);
        expect(error.name).toBe(ERROR_CODE_ENUM.DEFAULT_ERROR);
        expect(error.code).toBe(code);
        expect(error.message).toBe(description);
      });
    });

    it('should have proper inheritance from Error', () => {
      const error = new ErrorDatabaseDefault('TEST_CODE', 'Test description');

      expect(error instanceof Error).toBe(true);
      expect(error.stack).toBeDefined();
      expect(typeof error.toString).toBe('function');
    });
  });
});
