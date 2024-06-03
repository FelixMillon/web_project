import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  private users: User[] = [];

  @Query(() => [User])
  getUsers(): User[] {
    return this.users;
  }

  @Mutation(() => User)
  createUser(@Args('username') username: string): User {
    const user = { id: (this.users.length + 1).toString(), username };
    this.users.push(user);
    return user;
  }
}
