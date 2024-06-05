import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from '../auth/dto/login-response.dto';
import { Conversation } from '../conversations/conversation.model';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Query(() => User)
  getUserById(@Args('id') id: string): User {
    return this.userService.findById(id);
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
  updateUser(
    @Args('id') id: string,
    @Args('email') email: string | null,
    @Args('pseudo') pseudo: string | null,
    @Args('name') name: string | null
  ): Promise<User> {
    // recuperer id via tokens
    return this.userService.update({ id, email, pseudo, name } as Partial<User>);
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id') id: string): boolean {
    // recuperer id via tokens
    return this.userService.delete(id);
  }

  @Mutation(() => String)
  logIn(
    @Args('email') email: string, 
    @Args('password') password: string,
  ): string {
    return this.userService.logIn(email, password);
  }

  @Query(() => [Conversation])
  getAllConversations(@Args('userId') userId: string): Conversation[] {
    // recuperer id via tokens
    return this.userService.getAllConversations(userId);
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
