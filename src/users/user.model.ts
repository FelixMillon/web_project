import { Field, ObjectType, ID } from '@nestjs/graphql';

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
}
