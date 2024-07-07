
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException  } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { MessageService } from './message.service';
import { BullQueueService } from '../bull/bull-queue.service';
import { getPayload } from '../auth/auth.util';
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
    @Args('token') token: string,
    @Args('content') content: string
  ): Promise<Partial<Message>> {
    const payload = getPayload(token)
    const newMessage = this.messageService.publish(
      conversationId,
      eventType,
      payload.id,
      content
    );
    await this.bullQueueService.addJob({ newMessage });
    return newMessage;
  }

  @Mutation(() => Boolean)
  async deleteMessageById(
    @Args('token') token: string,
    @Args('id') id: string
  ): Promise<boolean> {
    this.checkIsMyMessage(token, id)
    return this.messageService.deleteById(id);
  }

  @Mutation(() => Boolean)
  async deleteMessageByAuthor(
    @Args('token') token: string
  ): Promise<boolean> {
    const payload = getPayload(token)
    return await this.messageService.deleteByAuthor(payload.id);
  }

  @Mutation(() => Boolean)
  async deleteMessageByConversationId(
    @Args('conversationId') conversationId: string
): Promise<boolean> {
    return await this.messageService.deleteByConversationId(conversationId);
  }

  @Query(() => Message)
  async getMessageById(@Args('id') id: string): Promise<Partial<Message>> {
    return await this.messageService.getById(id);
  }

  @Query(() => [Message])
  async getMessageByAuthor(@Args('token') token: string): Promise<Partial<Message>[]> {
    const payload = getPayload(token)
    return await this.messageService.getByAuthor(payload.id);
  }

  @Query(() => [Message])
  async getMessageByConversation(@Args('conversationId') conversationId: string): Promise<Partial<Message>[]> {
    return await this.messageService.getByConversationId(conversationId);
  }

  async checkIsMyMessage(token: string, id: string){
    const payload = getPayload(token)
    const message = await this.messageService.getById(id)
    if(!(message.id == payload.id)){
      throw new UnauthorizedException("Non autorisé à gérer ce message");
    }
  }
}
