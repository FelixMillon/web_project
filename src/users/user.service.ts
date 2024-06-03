import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  getAllConversations(userId: string): import("../conversations/conversation.model").Conversation[] {
    throw new Error('Method not implemented.');
  }
  private users: User[] = [];

  findById(id: string): User {
    return this.users.find(user => user.id === id);
  }

  create(username: string, email: string, password: string): User {
    const newUser = { id: (this.users.length + 1).toString(), username, email, password };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, username: string, email: string): User {
    const user = this.findById(id);
    if (user) {
      user.username = username;
      user.email = email;
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
      return 'JWT_TOKEN'; // Replace JWT Token
    }
    return null;
  }
}
