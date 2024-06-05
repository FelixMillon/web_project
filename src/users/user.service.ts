import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { Conversation } from '../conversations/conversation.model';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllConversations(id: string): Conversation[] {
    const user = this.users.find(user => user.id === id);
    return user.conversations
  }

  findById(id: string): User {
    return this.users.find(user => user.id === id);
  }

  create(email: string, pseudo: string, name: string, password: string): User {
    const newUser = {
      id: (this.users.length + 1).toString(),
      email,
      pseudo,
      name,
      password,
      conversations: []
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, email: string | null, pseudo: string | null, name:  string | null): User {
    const user = this.findById(id);
    if (user) {
      if(email){
        user.email = email;
      }
      if(pseudo){
        user.pseudo = pseudo;
      }
      if(name){
        user.name = name;
      }
    }
    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  logIn(email: string, password: string): string {
    const user = this.users.find(user => user.email === email && user.password === password);
    if (user) {
      return 'JWT_TOKEN';
    }
    return null;
  }
}
