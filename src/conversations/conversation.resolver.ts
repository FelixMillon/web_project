import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Conversation } from './conversation.model';
import { ConversationService } from './conversation.service';
import { User } from '../users/user.model';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private conversationService: ConversationService) {}

  @Mutation(() => Conversation)
  createConversation(
    @Args('ownersId', { type: () => [String] }) ownersId: string[],
    @Args('name') name: string
  ): Conversation {
    //utiliser token pour récupérer 1er ID
    return this.conversationService.create(ownersId, name);
  }

  @Mutation(() => Conversation)
  updateConversation(
    @Args('id') id: string,
    @Args('name', { type: () => [String] }) name: string
  ): Conversation {
    //verifier avec token si droit de modification (id dans owners de la conv)
    return this.conversationService.update(id, name);
  }

  @Mutation(() => Conversation)
  joinConversation(
    @Args('id') id: string,
    @Args('userId') userId: string
  ): boolean {
    //utiliser token pour id
    return this.conversationService.join(id, userId);
  }

  @Mutation(() => Conversation)
  leaveConversation(
    @Args('id') id: string,
    @Args('userId') userId: string
  ): boolean {
    //utiliser token pour id
    return this.conversationService.leave(id, userId);
  }

  @Mutation(() => Conversation)
  invitesTo(
    @Args('id') id: string,
    @Args('userId') userId: string
  ): boolean {
    //utiliser token pour vérifier droit sur la conv
    return this.conversationService.invitesTo(id, userId);
  }

  @Mutation(() => Conversation)
  expulseOff(
    @Args('id') id: string,
    @Args('userId') userId: string
  ): boolean {
    //utiliser token pour vérifier droit sur la conv
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
