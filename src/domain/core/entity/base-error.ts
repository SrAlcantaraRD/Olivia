export interface IErrorDetails {
  code: string;
  messages: string[]; //TODO: use Ti18nKeys
}

export class BaseError extends Error {
  public override readonly name: string;
  public readonly code: string;

  constructor(name: string, code: string, description: string) {
    super(description);

    this.name = name;
    this.code = code;

    // TODO: Add a logger here
    // Logger({
    //   name,
    //   code,
    //   message: description,
    //   level: 'error',
    // })

    Error.captureStackTrace(this);
  }
}

// TODO: Modify errors to use the next pattern:
// export class DomainError extends Error {
//   constructor(
//     public code: string,
//     public message: string,
//     public statusCode: number = 500,
//     public details?: Record<string, unknown>
//   ) {
//     super(message);
//     this.name = 'DomainError';
//   }
// }

// export const Errors = {
//   UserNotFound: new DomainError('USER_NOT_FOUND', 'User not found', 404),
//   InvalidEmail: new DomainError('INVALID_EMAIL', 'Invalid email format', 400),
//   DuplicateEmail: new DomainError('DUPLICATE_EMAIL', 'Email already exists', 409),
// } as const;
