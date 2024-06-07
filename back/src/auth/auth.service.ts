import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { comparePassword, createJWT, JWTUser } from './auth.util';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<JWTUser | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      console.log(`validateUser - User with email ${email} not found`);
      return null;
    }

    const isPasswordMatching = await comparePassword(pass, user.password);
    if (!isPasswordMatching) {
      console.log(`validateUser - Invalid password for user with email ${email}`);
      return null;
    }

    const { id, name, pseudo } = user;
    console.log(`validateUser - User validated: ${JSON.stringify({ id, name, email, pseudo })}`);
    return { id, name, email, pseudo };
  }

  async login(user: JWTUser): Promise<LoginResponse> {
    const token = createJWT(user);
    console.log(`login - JWT generated: ${token}`);
    return { access_token: token };
  }
}
