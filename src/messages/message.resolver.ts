import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Mutation(() => Message)
  publishMessage(@Args('conversationId') conversationId: string, @Args('content') content: string, @Args('senderId') senderId: string): Message {
    return this.messageService.publish(conversationId, content, senderId);
  }

  @Mutation(() => Boolean)
  deleteMessageById(@Args('id') id: string): boolean {
    return this.messageService.deleteById(id);
  }

  @Mutation(() => Boolean)
  deleteMessageByAuthor(@Args('authorId') authorId: string): boolean {
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
