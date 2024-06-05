
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { MessageService } from './message.service';
import { BullQueueService } from '../bull/bull-queue.service';
import { User } from '../users/user.model';
import { Message } from './message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly bullQueueService: BullQueueService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  async publishMessage(
    @Args('conversationId') conversationId: string,
    @Args('eventType') eventType: string,
    @Args('authorId') authorId: string,
    @Args('content') content: string
  ): Promise<Message> {
    // utiliser le token pour authorId
    const newMessage =  this.messageService.publish(
      conversationId,
      eventType,
      authorId,
      content
    );
    await this.bullQueueService.addJob({ newMessage });
    return newMessage;
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
