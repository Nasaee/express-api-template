import { NextFunction, Request, Response } from 'express';
import { ErrorCode, HttpException } from '../exceptions/RootExceptions';
import { ZodError } from 'zod';
import { BadRequestException } from '../exceptions/BadRequestException';
import { InternalErrorException } from '../exceptions/InternalError';
export const errorHandlerMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors,
    });
  } else {
    res.status(500).json({
      message: 'Internal server error',
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(
            'Unprocessable entity',
            ErrorCode.UNPROCESSABLE_ENTITY,
            error.issues
          );
        } else {
          exception = new InternalErrorException('Somthing went wrong');
        }
      }
      next(exception);
    }
  };
};
