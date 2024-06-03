import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Conversation } from './conversation.model';
import { User } from '../users/user.model';
import { Message } from '../messages/message.model';

@Resolver(() => Conversation)
export class ConversationResolver {
  private conversations: Conversation[] = [];

  @Query(() => [Conversation])
  getConversations(): Conversation[] {
    return this.conversations;
  }

  @Mutation(() => Conversation)
  createConversation(
    @Args('userIds', { type: () => [String] }) userIds: string[],
  ): Conversation {
    const conversation: Conversation = {
      id: (this.conversations.length + 1).toString(),
      participants: userIds.map(id => ({ id, username: '' } as User)), 
      messages: [],
    };
    this.conversations.push(conversation);
    return conversation;
  }

  @Query(() => [Message])
  getMessages(@Args('conversationId') conversationId: string): Message[] {
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    return conversation ? conversation.messages : [];
  }
}
