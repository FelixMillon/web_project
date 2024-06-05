import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.model';
import { LoginResponse } from '../auth/dto/login-response.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('pseudo') pseudo: string,
    @Args('name') name: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.usersService.create({ email, pseudo, name, password } as Partial<User>);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Unauthorized');
    }
    const loginResult = await this.authService.login(user);
    return loginResult;
  }

  @Query(() => User, { nullable: true })
  async findOneByEmail(@Args('email') email: string): Promise<User | null> {
    return this.usersService.findOneByEmail(email);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
