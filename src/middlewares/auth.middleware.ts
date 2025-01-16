import { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../exceptions/RootExceptions';

import jwt from 'jsonwebtoken';
import db from '../db/db';
import { User } from '@prisma/client';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { generateToken } from '../services/generateToken.service';
import { EXPIRES_IN_MINUTES } from '../configs/constants';

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
  try {
    const token = req.header('Authorization')?.replace(/^Bearer\s/i, ''); // remove Bearer from token (i is for case-insensitive)

    if (!token) {
      return next(new UnauthorizedException('Unauthorized'));
    }

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

    // Refresh token only if it's about to expire.
    const timeToExpire = payload.exp! * 1000 - Date.now();
    const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    // Check if the token is close to expiration
    if (timeToExpire < REFRESH_THRESHOLD) {
      const newToken = generateToken(user.id);
      res.cookie('authToken', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: EXPIRES_IN_MINUTES * 60 * 1000,
      });
      req.headers.authorization = `Bearer ${newToken}`;
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException('Unauthorized', ErrorCode.TOKEN_EXPIRED);
    }
    throw new UnauthorizedException('Unauthorized');
  }
};

export { authMiddleware };
