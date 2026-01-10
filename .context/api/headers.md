# HTTP headers, middleware, and CORS

The Oliva app is local-first with no network APIs. "Headers" refer to local middleware patterns for request/response handling.

## Local middleware patterns

Since there's no HTTP server, middleware handles local operation pipelines.

### Validation middleware

```typescript
// Zod-based request validation
class ValidationMiddleware {
  static validateRequest<T>(
    schema: z.ZodSchema<T>
  ): (request: unknown) => Promise<T> {
    return async (request: unknown) => {
      try {
        return await schema.parseAsync(request);
      } catch (error) {
        throw new ValidationError('Invalid request data', error);
      }
    };
  }
}

// Usage in use-case
const validatedRequest = await ValidationMiddleware.validateRequest(
  TCreateRecordRequest
)(rawRequest);
```

### Error handling middleware

```typescript
// Error boundary wrapper
class ErrorBoundaryMiddleware {
  static wrap<T>(
    operation: () => Promise<T>
  ): Promise<T | { error: ErrorResponse }> {
    return operation().catch((error) => ({
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        details: error.details,
      },
    }));
  }
}

// Usage
const result = await ErrorBoundaryMiddleware.wrap(async () => {
  return await useCase.execute(request);
});
```

### Logging middleware

```typescript
// Operation logging
class LoggingMiddleware {
  static logOperation(operationName: string) {
    return <T extends any[], R>(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const method = descriptor.value;
      descriptor.value = async (...args: T): Promise<R> => {
        console.log(`[${operationName}] Starting ${propertyKey}`);
        try {
          const result = await method.apply(target, args);
          console.log(`[${operationName}] Completed ${propertyKey}`);
          return result;
        } catch (error) {
          console.error(`[${operationName}] Failed ${propertyKey}:`, error);
          throw error;
        }
      };
    };
  }
}

// Usage
class CarerUseCase {
  @LoggingMiddleware.logOperation('CarerUseCase')
  async createCarer(request: TCreateCarerRequest): Promise<TCarer> {
    // Implementation
  }
}
```

## Request/response headers

Local operations use "header" objects for metadata.

### Request headers

```typescript
interface IRequestHeaders {
  requestId: string;
  timestamp: number;
  userAgent: string;
  locale: string;
  version: string;
}

// Request wrapper
interface IRequest<T> {
  headers: IRequestHeaders;
  body: T;
}
```

### Response headers

```typescript
interface IResponseHeaders {
  requestId: string;
  timestamp: number;
  processingTime: number;
  version: string;
}

// Response wrapper
interface IResponse<T> {
  headers: IResponseHeaders;
  body: T;
  error?: IErrorResponse;
}
```

## CORS configuration

No CORS needed for local-first app. For future web extensions:

```typescript
// CORS middleware (if needed for web version)
const corsConfig = {
  origin: ['https://oliva-app.com', 'exp://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
```

## Authentication headers

Local auth uses session tokens in headers.

- **Local optimization**: No HTTP parsing overhead
- **Flexibility**: Add custom metadata easily

Trade-off: Not compatible with standard HTTP tools.

### Why rate limiting locally?

- **Resource protection**: Prevent excessive DB operations
- **User experience**: Prevent UI freezing from rapid actions
- **Testing**: Simulate network rate limits

Trade-off: Additional complexity for local app.

### Why compression for QR data?

- **Capacity**: QR codes have size limits
- **Performance**: Faster scanning with smaller codes
- **Compatibility**: Works with standard QR readers

Trade-off: CPU overhead for compression/decompression.
