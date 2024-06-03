import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Conversation } from './conversation.model';
import { ConversationService } from './conversation.service';
import { User } from '../users/user.model';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private conversationService: ConversationService) {}

  @Mutation(() => Conversation)
  createConversation(@Args('userIds', { type: () => [String] }) userIds: string[]): Conversation {
    return this.conversationService.create(userIds);
  }

  @Mutation(() => Conversation)
  updateConversation(@Args('id') id: string, @Args('userIds', { type: () => [String] }) userIds: string[]): Conversation {
    return this.conversationService.update(id, userIds);
  }

  @Mutation(() => Conversation)
  joinConversation(@Args('id') id: string, @Args('userId') userId: string): Conversation {
    return this.conversationService.join(id, userId);
  }

  @Mutation(() => Conversation)
  leaveConversation(@Args('id') id: string, @Args('userId') userId: string): Conversation {
    return this.conversationService.leave(id, userId);
  }

  @Mutation(() => Conversation)
  invitesTo(@Args('id') id: string, @Args('userId') userId: string): Conversation {
    return this.conversationService.invitesTo(id, userId);
  }

  @Mutation(() => Conversation)
  expulseOff(@Args('id') id: string, @Args('userId') userId: string): Conversation {
    return this.conversationService.expulseOff(id, userId);
  }

  @Query(() => [User])
  getParticipants(@Args('id') id: string): User[] {
    return this.conversationService.getParticipants(id);
  }

  @Query(() => [User])
  getOwners(@Args('id') id: string): User[] {
    return this.conversationService.getOwners(id);
  }
}
