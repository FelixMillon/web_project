import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Message } from './message.model';
import { User } from '../users/user.model';
import { Conversation } from '../conversations/conversation.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessageService {
  constructor(
    @Inject(forwardRef(() => RedisService))
    private redisService: RedisService
  ) {}
  private messages: Message[] = [];
  private conversations: Conversation[] = [];
  private users: User[] = [];

  async saveMessage(message: Message): Promise<Message> {
    this.messages.push(message);
    return message;
  }

  async publish(
    conversationId: string,
    eventType: string,
    authorId: string,
    content: string
  ): Promise<Message> {
    const conversation = await this.redisService.get(`conversation:${conversationId}`);
    const author = this.users.find(user => user.id === authorId)
    const message = {
      id: uuidv4(),
      conversation,
      eventType,
      timestamp: new Date,
      author,
      content
    };
    await this.redisService.set(`message:${message.id}`, message);
    return message;
  }

  deleteById(id: string, authorId): boolean {

    const index = this.messages.findIndex(msg => msg.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteByAuthor(authorId: string): boolean {
    this.messages = this.messages.filter(msg => msg.author.id !== authorId);
    return true;
  }

  deleteByConversationId(conversationId: string): boolean {
    this.messages = this.messages.filter(msg => msg.conversation.id !== conversationId);
    return true;
  }

  getById(id: string): Message {
    return this.messages.find(msg => msg.id === id);
  }

  getByAuthor(authorId: string): Message[] {
    return this.messages.filter(msg => msg.author.id === authorId);
  }
}
