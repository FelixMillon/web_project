import { Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { User } from '../users/user.model';

@Injectable()
export class MessageService {
  private messages: Message[] = [];

  publish(conversationId: string, content: string, senderId: string): Message {
    const message = {
      id: (this.messages.length + 1).toString(),
      content,
      sender: { id: senderId, username: '', email: '', password: '' } as User,
      timestamp: new Date().toISOString(),
      conversationId, 
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
    this.messages = this.messages.filter(msg => msg.sender.id !== authorId);
    return true;
  }

  deleteByConversationId(conversationId: string): boolean {
    this.messages = this.messages.filter(msg => msg.conversationId !== conversationId);
    return true;
  }

  getById(id: string): Message {
    return this.messages.find(msg => msg.id === id);
  }

  getByAuthor(authorId: string): Message[] {
    return this.messages.filter(msg => msg.sender.id === authorId);
  }
}
