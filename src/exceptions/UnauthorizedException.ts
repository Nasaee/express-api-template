import { ErrorCode, HttpException } from './RootExceptions';

export class UnauthorizedException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, ErrorCode.UNAUTHORIZED, 401, errors);
  }
}
