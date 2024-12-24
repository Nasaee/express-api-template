import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../exceptions/Forbidden';

const allowedRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenException('You are not allowed to access this resource')
      );
    }
    next();
  };
};

export { allowedRole };
