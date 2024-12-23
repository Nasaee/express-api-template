import { ErrorCode, HttpException } from './RootExceptions';

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 404, errors);
  }
}
