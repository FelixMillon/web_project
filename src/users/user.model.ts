import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Conversation } from '../conversations/conversation.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  pseudo: string;

  @Field()
  name: string;

  @Field()
  password: string; 

  @Field(() => [Conversation])
  conversations: Conversation[]; 
}
