import { Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { User } from '../users/user.model';
import { Conversation } from '../conversations/conversation.model';

@Injectable()
export class MessageService {
  private messages: Message[] = [];
  private conversations: Conversation[] = [];
  private users: User[] = [];

  publish(
    conversationId: string,
    eventType: string,
    authorId: string,
    content: string
  ): Message {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    const author = this.users.find(user => user.id === authorId)
    const message = {
      id: (this.messages.length + 1).toString(),
      conversation,
      eventType,
      timestamp: Date.now(),
      author,
      content
    };
    this.messages.push(message);
    return message;
  }

  deleteById(id: string): boolean {
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
