
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
  async sendMessage(
    @Args('content') content: string,
    @Args('conversationId') conversationId: string,
    @Context() context: any
  ): Promise<Message> {
    const user: User = context.req.user;

    const message = new Message();
    message.id = Date.now().toString();
    message.eventType = 'message_sent';
    message.timestamp = new Date();
    message.content = content;
    message.author = user;

    await this.bullQueueService.addJob({ message });

    return this.messageService.saveMessage(message);

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
