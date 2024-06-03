import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { User } from '../users/user.model';

@Injectable()
export class ConversationService {
  private conversations: Conversation[] = [];

  create(userIds: string[]): Conversation {
    const conversation = {
      id: (this.conversations.length + 1).toString(),
      participants: userIds.map(id => ({ id, username: '', email: '', password: '' } as User)),
      owners: [],
    };
    this.conversations.push(conversation);
    return conversation;
  }

  update(id: string, userIds: string[]): Conversation {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.participants = userIds.map(id => ({ id, username: '', email: '', password: '' } as User));
    }
    return conversation;
  }

  join(id: string, userId: string): Conversation {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      const user = { id: userId, username: '', email: '', password: '' } as User;
      conversation.participants.push(user);
    }
    return conversation;
  }

  leave(id: string, userId: string): Conversation {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.participants = conversation.participants.filter(part => part.id !== userId);
    }
    return conversation;
  }

  invitesTo(id: string, userId: string): Conversation {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      const user = { id: userId, username: '', email: '', password: '' } as User;
      conversation.owners.push(user);
    }
    return conversation;
  }

  expulseOff(id: string, userId: string): Conversation {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      conversation.participants = conversation.participants.filter(part => part.id !== userId);
    }
    return conversation;
  }

  getParticipants(id: string): User[] {
    const conversation = this.conversations.find(conv => conv.id === id);
    return conversation ? conversation.participants : [];
  }

  getOwners(id: string): User[] {
    const conversation = this.conversations.find(conv => conv.id === id);
    return conversation ? conversation.owners : [];
  }
}
