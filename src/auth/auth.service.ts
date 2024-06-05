import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword, createJWT, JWTUser } from './auth.util';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<JWTUser | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.log(`validateUser - User with email ${email} not found`);
      return null;
    }

    const isPasswordMatching = await comparePassword(pass, user.password);
    if (!isPasswordMatching) {
      console.log(`validateUser - Invalid password for user with email ${email}`);
      return null;
    }

    const { id, name } = user;
    console.log(`validateUser - User validated: ${JSON.stringify({ id, name, email })}`);
    return { id, name, email };
  }

  async login(user: JWTUser): Promise<LoginResponse> {
    const token = createJWT(user);
    console.log(`login - JWT generated: ${token}`);
    return { access_token: token };
  }
}
