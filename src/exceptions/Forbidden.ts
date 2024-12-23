// HTTP status code that indicates a user doesn't have permission to access a specific part of a website

import { ErrorCode, HttpException } from './RootExceptions';

export class ForbiddenException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, ErrorCode.FORBIDDEN, 403, errors);
  }
}
