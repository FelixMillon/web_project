import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async createUser(@Body() createUserDto: Partial<User>): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: { email: string; password: string }): Promise<any> {
    console.log('loginUser - Received login request');
    const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      console.log('loginUser - Unauthorized');
      throw new UnauthorizedException();
    }
    console.log('loginUser - User validated');
    return this.authService.login(user);
  }
}
