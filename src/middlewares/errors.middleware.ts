import { NextFunction, Request, Response } from 'express';
import { ErrorCode, HttpException } from '../exceptions/RootExceptions';
import { ZodError } from 'zod';
import { BadRequestException } from '../exceptions/BadRequestException';
import { InternalErrorException } from '../exceptions/InternalError';
import { logErrorToFile } from '../utils/errorLogger';
import moment from 'moment';

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
          console.log(error);
          exception = new InternalErrorException('Somthing went wrong');
        }
      }
      next(exception); // Pass the error to the error middleware
    }
  };
};

export const errorHandlerMiddleware = async (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`Error occurred on ${req.method} ${req.url}`, error);

  if (error instanceof HttpException) {
    // Log HttpExceptions to a file
    const currentTime = moment().format('YYYY-MM-DD hh:mm A');
    await logErrorToFile(
      `[${currentTime}] HttpException: [${error.statusCode}] ${error.message} (Code: ${error.errorCode})`
    );

    res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors,
    });
  } else {
    // Handle unexpected errors
    const errorMessage = `Unexpected Error: ${JSON.stringify(error)}`;
    await logErrorToFile(errorMessage);

    res.status(500).json({
      message: 'Internal server error',
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }
};
