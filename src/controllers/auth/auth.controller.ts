import { NextFunction, Request, Response } from 'express';
import { signUpSchema } from '../../schemas/signUp.schema';
import db from '../../db/db';
import { BadRequestException } from '../../exceptions/BadRequestException';
import { ErrorCode } from '../../exceptions/RootExceptions';
import jwt from 'jsonwebtoken';
import { InternalErrorException } from '../../exceptions/InternalError';
import PasswordUtil from '../../utils/classes/PasswordUtil';

const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('signUpController');

  try {
    const { firstName, lastName, email, password } = signUpSchema.parse(
      req.body
    );

    const existingUser = await db.user.findUnique({
      where: { email, firstName, lastName, password: password },
    });

    if (existingUser) {
      return next(
        new BadRequestException(
          'User already exists',
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    const hashedPassword = await PasswordUtil.encryptPassword(password);

    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:
          (parseInt(process.env.JWT_EXPIRATION as string, 10) || 1) * 3600000,
      })
      .status(201)
      .json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);

    next(new InternalErrorException('Error creating user', error));
  }
};

const loginController = async (req: Request, res: Response) => {};

export { signUpController, loginController };
