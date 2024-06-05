import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [User])
  users: User[];

  @Field(() => [User])
  owners: User[];

  @Field()
  timestamp: number;
}
