import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.model';
import { Conversation } from '../conversations/conversation.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field(() => Conversation)
  conversation: Conversation;

  @Field()
  eventType: string;

  @Field()
  timestamp: number;

  @Field(() => User)
  author: User;

  @Field()
  content: string;
}
