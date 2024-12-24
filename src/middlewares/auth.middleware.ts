import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exceptions/BadRequestException';
import { ErrorCode } from '../exceptions/RootExceptions';

import jwt from 'jsonwebtoken';
import db from '../db/db';
import { User } from '@prisma/client';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

declare global {
  namespace Express {
    interface Request {
      user: Omit<User, 'password'>;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization');
  if (!token) {
    return next(
      new BadRequestException('Token not found', ErrorCode.TOKEN_NOT_FOUND)
    );
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const user = await db.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return next(
        new UnauthorizedException('User not found', ErrorCode.USER_NOT_FOUND)
      );
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException('Token expired', ErrorCode.TOKEN_EXPIRED);
    }
    throw new UnauthorizedException('Unauthorized');
  }
};

export { authMiddleware };
