import jwt from 'jsonwebtoken';
import { EXPIRES_IN_MINUTES } from '../configs/constants';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: `${EXPIRES_IN_MINUTES}m`,
  });
};

export { generateToken };
