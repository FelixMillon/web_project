import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.model';

export type JWTUser = Pick<User, 'id' | 'name' | 'email'>;

export const createJWT = (user: JWTUser): string => {
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY as string);
  return token;
};

export const getUser = (token: string): JWTUser | null => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JWTUser;
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 5);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
