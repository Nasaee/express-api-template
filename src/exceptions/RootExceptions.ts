export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 1001,
  UNAUTHORIZED = 1002,
  NOT_FOUND = 1003,
  BAD_REQUEST = 1004,
  ALREADY_EXISTS = 1005,
  PATH_NOT_FOUND = 1006,
  FORBIDDEN = 1007,
  UNPROCESSABLE_ENTITY = 1008,
}

export class HttpException extends Error {
  constructor(
    public message: string,
    public errorCode: ErrorCode,
    public statusCode: number,
    public errors?: any
  ) {
    super(message);
  }
}
