import { NextFunction, Request, Response } from 'express';
import { HttpException, ErrorCode } from '../exceptions/RootExceptions';
import { ZodError } from 'zod';
import { BadRequestException } from '../exceptions/BadRequestException';
import { InternalErrorException } from '../exceptions/InternalError';

/**
 * Global Error Handling Middleware for Express.
 * Handles various types of known and unknown errors.
 */
export const errorHandlerMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error Middleware Caught:', error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errorCode: ErrorCode.BAD_REQUEST,
      errors: error.errors,
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'An error occurred',
      errorCode: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      errors: error.errors || null,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    message: 'Internal Server Error',
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    errors: null,
  });
};

/**
 * Utility wrapper for handling async route methods gracefully.
 * Catches errors and forwards them to the errorHandlerMiddleware.
 */
export const errorHandler = (
  method: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      if (error instanceof HttpException) {
        return next(error);
      }

      if (error instanceof ZodError) {
        return next(
          new BadRequestException(
            'Validation failed',
            ErrorCode.BAD_REQUEST,
            error.issues
          )
        );
      }

      return next(new InternalErrorException('Something went wrong'));
    }
  };
};
