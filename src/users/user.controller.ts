import { Controller, Post, Body, Get, Param, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.model';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async createUser(@Body() createUserDto: Partial<User>): Promise<User> {
    return this.userService.create(createUserDto);
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

  @Get(':email')
  async findOneByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findOneByEmail(email);
  }
}
