import { UnauthorizedException  } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Conversation } from './conversation.model';
import { ConversationService } from './conversation.service';
import { getPayload } from '../auth/auth.util';
import { User } from '../users/user.model';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(
    private conversationService: ConversationService
  ) {}

  @Mutation(() => Conversation)
  async createConversation(
    @Args('token') token: string,
    @Args('ownersId', { type: () => [String] }) ownersId: string[],
    @Args('name') name: string
  ): Promise<Conversation> {
    const payload = getPayload(token)
    ownersId.push(payload.id)
    return await this.conversationService.create(ownersId, name);
  }

  @Mutation(() => Conversation)
  async updateConversation(
    @Args('token') token: string,
    @Args('id') id: string,
    @Args('name', { type: () => [String] }) name: string
  ): Promise<Conversation> {
    await this.checkRightsOnConv(token, id)
    return await this.conversationService.update(id, name);
  }

  @Mutation(() => Conversation)
  async joinConversation(
    @Args('id') id: string,
    @Args('token') token: string
  ): Promise<boolean> {
    const payload = getPayload(token)
    return await this.conversationService.join(id, payload.id);
  }

  @Mutation(() => Conversation)
  async leaveConversation(
    @Args('id') id: string,
    @Args('token') token: string
  ): Promise<boolean> {
    const payload = getPayload(token)
    return await this.conversationService.leave(id, payload.id);
  }

  @Mutation(() => Conversation)
  async invitesTo(
    @Args('id') id: string,
    @Args('userId') userId: string,
    @Args('token') token: string
  ): Promise<boolean> {
    await this.checkRightsOnConv(token, id)
    return await this.conversationService.join(id, userId);
  }

  @Mutation(() => Conversation)
  async expulseOff(
    @Args('id') id: string,
    @Args('userId') userId: string,
    @Args('token') token: string
  ): Promise<boolean> {
    await this.checkRightsOnConv(token, id)
    return await this.conversationService.leave(id, userId);
  }

  @Query(() => [User])
  async getParticipants(@Args('id') id: string): Promise<User[]> {
    return await this.conversationService.getParticipants(id);
  }

  @Query(() => [User])
  async getOwners(@Args('id') id: string): Promise<User[]> {
    return await this.conversationService.getOwners(id);
  }

  async checkRightsOnConv(token: string, id: string){
    const payload = getPayload(token)
    const owners = await this.conversationService.getOwners(id)
    if(! owners.some(user => user.id === payload.id)){
      throw new UnauthorizedException("Non autorisé gérer cette conversation");
    }
  }
}
