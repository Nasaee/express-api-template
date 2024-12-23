import { ErrorCode, HttpException } from './RootExceptions';

// Use when the request comes with invalid data
export class UnprocessableEntityException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, ErrorCode.UNPROCESSABLE_ENTITY, 422, errors);
  }
}
