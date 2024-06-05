import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { Conversation } from '../conversations/conversation.model'; 

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  getUserById(@Args('id') id: string): User {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  createUser(
    @Args('email') email: string,
    @Args('pseudo') pseudo: string,
    @Args('name') name: string,
    @Args('password') password: string,
  ): User {
    return this.userService.create(
      email,
      pseudo,
      name,
      password
    );
  }

  @Mutation(() => User)
  updateUser(
    @Args('id') id: string,
    @Args('email') email: string | null,
    @Args('pseudo') pseudo: string | null,
    @Args('name') name: string | null
  ): User {
    // recuperer id via tokens
    return this.userService.update(id, email, pseudo, name);
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
}
