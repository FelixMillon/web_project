import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { MessagesService } from './messages.service';
import { BullQueueService } from '../bull/bull-queue.service';
import { Message } from './message.model';
import { User } from '../users/user.model';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
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

    return this.messagesService.saveMessage(message);
  }
}
