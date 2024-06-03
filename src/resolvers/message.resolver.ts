import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BullQueueService } from '../bull/bull-queue.service';
import { Message } from '../models/message.model';
// import { User } from '../models/user.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly bullQueueService: BullQueueService) {}

  @Mutation(() => Message)
  async sendMessage(
    @Args('content') content: string,
    @Args('conversationId') conversationId: string
  ): Promise<Message> {
    const message = new Message();
    message.id = Date.now().toString();
    message.eventType = 'message_sent';
    message.timestamp = new Date();
    message.content = content;
    // message.author = { id: '1', username: 'User1' }; 

    await this.bullQueueService.addJob({ message });

    return message;
  }
}
