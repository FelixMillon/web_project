import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.login(user);
    return token.access_token;
  }
}
