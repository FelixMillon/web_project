import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Message } from './message.model';
import { ConversationResolver } from '../conversations/conversation.resolver';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private conversationResolver: ConversationResolver) {}

  @Mutation(() => Message)
  sendMessage(
    @Args('conversationId') conversationId: string,
    @Args('content') content: string,
    @Args('senderId') senderId: string,
  ): Message {
    const message: Message = {
      id: (new Date().getTime()).toString(),
      content,
      sender: { id: senderId, username: '' }, 
      timestamp: new Date().toISOString(),
    };
    const conversation = this.conversationResolver.getConversations().find(conv => conv.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);
    }
    return message;
  }
}
