import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Mutation(() => Message)
  publishMessage(
    @Args('conversationId') conversationId: string,
    @Args('eventType') eventType: string,
    @Args('authorId') authorId: string,
    @Args('content') content: string
  ): Message {
    // utiliser le token pour authorId
    return this.messageService.publish(
      conversationId,
      eventType,
      authorId,
      content
    );
  }

  @Mutation(() => Boolean)
  deleteMessageById(@Args('id') id: string): boolean {
    // utiliser le token pour vérifier que l'authorId du message correspond au token
    return this.messageService.deleteById(id);
  }

  @Mutation(() => Boolean)
  deleteMessageByAuthor(@Args('authorId') authorId: string): boolean {
    // utiliser le token pour vérifier que l'authorId du message correspond au token
    return this.messageService.deleteByAuthor(authorId);
  }

  @Mutation(() => Boolean)
  deleteMessageByConversationId(@Args('conversationId') conversationId: string): boolean {
    return this.messageService.deleteByConversationId(conversationId);
  }

  @Query(() => Message)
  getMessageById(@Args('id') id: string): Message {
    return this.messageService.getById(id);
  }

  @Query(() => [Message])
  getMessageByAuthor(@Args('authorId') authorId: string): Message[] {
    return this.messageService.getByAuthor(authorId);
  }
}
