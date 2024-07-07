import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from '../auth/dto/login-response.dto';
import { Conversation } from '../conversations/conversation.model';
import { getPayload } from '../auth/auth.util';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.userService.findById(id);
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

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('pseudo') pseudo: string,
    @Args('name') name: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.userService.create(
      { email, pseudo, name, password } as Partial<User>
    );
  }

  @Mutation(() => User)
  async updateUser(
    @Args('token') token: string,
    @Args('email', { defaultValue: null }) email: string | null,
    @Args('pseudo', { defaultValue: null }) pseudo: string | null,
    @Args('name', { defaultValue: null }) name: string | null,
  ): Promise<User> {

    const payload = getPayload(token)
    return this.userService.update(payload.id, { email, pseudo, name } as Partial<User>);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('token') token: string): Promise<boolean> {
    const payload = getPayload(token)
    return this.userService.delete(payload.id);
  }

  @Query(() => [Conversation])
  async getAllConversations(@Args('token') token: string): Promise<Conversation[] | null> {
    const payload = getPayload(token)
    return await this.userService.getAllConversations(payload.id);
  }

  @Query(() => User, { nullable: true })
  async findOneByEmail(@Args('email') email: string): Promise<User | null> {
    return this.userService.findOneByEmail(email);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }
}
