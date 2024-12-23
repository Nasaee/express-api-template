import { ErrorCode, HttpException } from './RootExceptions';

export class InternalErrorException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, ErrorCode.INTERNAL_SERVER_ERROR, 500, errors);
  }
}
