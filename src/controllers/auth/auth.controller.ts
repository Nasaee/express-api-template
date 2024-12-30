import { NextFunction, Request, Response } from 'express';
import { signUpSchema } from '../../schemas/signUp.schema';
import db from '../../db/db';
import { BadRequestException } from '../../exceptions/BadRequestException';
import { ErrorCode } from '../../exceptions/RootExceptions';
import { InternalErrorException } from '../../exceptions/InternalError';
import PasswordUtil from '../../services/password.service';
import { signInSchema } from '../../schemas/signIn.schema';
import { generateToken } from '../../services/generateToken.service';

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
      where: { email },
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

    const token = generateToken(newUser.id);

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
    throw new InternalErrorException('Error creating user', error);
  }
};

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = signInSchema.parse(req.body);

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return next(
        new BadRequestException(
          'Invalid email or password',
          ErrorCode.INVALID_CREDENTIALS
        )
      );
    }

    const isPasswordValid = await PasswordUtil.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return next(
        new BadRequestException(
          'Invalid email or password',
          ErrorCode.INVALID_CREDENTIALS
        )
      );
    }

    const token = generateToken(user.id);

    res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge:
          (parseInt(process.env.JWT_EXPIRATION as string, 10) || 1) * 3600000,
      })
      .send({ message: 'Login successful' });
  } catch (error) {
    throw new InternalErrorException('Error creating user', error);
  }
};

const logoutController = async (req: Request, res: Response) => {
  res
    .cookie('authToken', '', { expires: new Date(0) })
    .send({ message: 'Logout successful' });
};

export { signUpController, loginController, logoutController };
