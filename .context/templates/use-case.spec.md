# Template: use-case unit test (AAA)

Use this template when adding a new `*.use-case.ts`.

```ts
import { describe, expect, it } from '@jest/globals';

import type { TRequestMyUseCase } from '@/domain/<scope>/use-case-schema/my.use-case-schema';
import { MyUseCase } from '@/domain/<scope>/use-case/my.use-case';
import { mockLoggerPort /* + required ports */ } from '@/tests/mocks';

describe('[UseCase] - MyUseCase', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    // const someAdapter = mockSomePort();

    const unit = new MyUseCase({
      loggerAdapter,
      // someAdapter,
    });

    return { unit, loggerAdapter /*, someAdapter */ };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns success for valid input', async () => {
    const { unit } = prepareSuiteCase();

    const payload = {
      // ...
    } satisfies TRequestMyUseCase;

    const result = await unit.execute(payload);

    expect(result.success).toBe(true);
  });

  it('returns error for invalid input', async () => {
    const { unit } = prepareSuiteCase();

    const payload = {} as unknown as TRequestMyUseCase;

    const result = await unit.execute(payload);

    expect(result.success).toBe(false);
  });
});
```

