import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  eventType: string;

  @Field()
  timestamp: Date;

  @Field(() => User)
  author: User;

  @Field()
  content: string;
}
