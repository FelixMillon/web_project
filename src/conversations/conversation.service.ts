import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { User } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConversationService {
  private conversations: Conversation[] = [];
  private users: User[] = [];

  create(ownersId: string[], name: string, ): Conversation {
    let owners = []
    for(let ownerId in ownersId){
      owners.push(this.users.find(user => user.id === ownerId))
    }
    const conversation = {
      id: uuidv4(),
      name,
      users: owners,
      owners,
      timestamp: Date.now()
    };
    this.conversations.push(conversation)
    return conversation;
  }

  update(id: string, name: string): Conversation {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.name = name;
    }
    return conversation;
  }

  // modifier cette fonction en utilisant le token
  join(id: string, userId: string): boolean {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.users.push(this.users.find(user => user.id === userId));
      return true
    }
    return false;
  }

  // modifier cette fonction en utilisant le token
  leave(id: string, userId: string): boolean {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.users = conversation.users.filter(user => user.id !== userId);
      return true
    }
    return false;
  }

  invitesTo(id: string, userId: string): boolean {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.users.push(this.users.find(user => user.id === userId));
      return true
    }
    return false;
  }

  expulseOff(id: string, userId: string): boolean {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.users = conversation.users.filter(user => user.id !== userId);
      return true
    }
    return false;
  }

  getParticipants(id: string): User[] {
    const conversation = this.conversations.find(conv => conv.id === id);
    return conversation ? conversation.users : [];
  }

  getOwners(id: string): User[] {
    const conversation = this.conversations.find(conv => conv.id === id);
    return conversation ? conversation.owners : [];
  }
}
