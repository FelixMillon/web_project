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
    @Args('username') username: string, 
    @Args('email') email: string, 
    @Args('password') password: string,
  ): User {
    return this.userService.create(username, email, password);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id') id: string, 
    @Args('username') username: string, 
    @Args('email') email: string,
  ): User {
    return this.userService.update(id, username, email);
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id') id: string): boolean {
    return this.userService.delete(id);
  }

  @Mutation(() => String)
  logIn(
    @Args('email') email: string, 
    @Args('password') password: string,
  ): string {
    return this.userService.logIn(email, password); // Return JWT token
  }

  @Query(() => [Conversation])
  getAllConversations(@Args('userId') userId: string): Conversation[] {
    return this.userService.getAllConversations(userId);
  }
}
