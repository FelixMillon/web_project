import { Injectable } from '@nestjs/common';
import { Message } from './message.model';

@Injectable()
export class MessagesService {
  private readonly messages: Message[] = [];

  async saveMessage(message: Message): Promise<Message> {
    this.messages.push(message);
    return message;
  }
}
