# Template: use-case-schema unit test

Use this template when adding a new `*.use-case-schema.ts`.

```ts
import { describe, expect, it } from '@jest/globals';

import {
  RequestMyUseCaseSchema,
  ResponseMyUseCaseSchema,
} from '@/domain/<scope>/use-case-schema/my.use-case-schema';

describe('[UseCaseSchema] - MyUseCase', () => {
  describe('Request', () => {
    it('accepts valid input', () => {
      const payload = {
        // ...
      };

      const result = RequestMyUseCaseSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects invalid input', () => {
      const payload = {
        // ...
      };

      const result = RequestMyUseCaseSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('Response', () => {
    it('accepts valid output', () => {
      const payload = {
        // ...
      };

      const result = ResponseMyUseCaseSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
```

