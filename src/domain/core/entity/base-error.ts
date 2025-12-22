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
