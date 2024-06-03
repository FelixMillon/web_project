import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => User)
  sender: User;

  @Field()
  timestamp: string;

  @Field()
  conversationId: string;
}
