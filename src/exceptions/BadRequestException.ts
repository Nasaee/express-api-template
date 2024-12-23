import { ErrorCode, HttpException } from './RootExceptions';

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}
