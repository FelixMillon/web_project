import { Injectable, Inject, forwardRef  } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { hashPassword } from '../auth/auth.util';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { Conversation } from '../conversations/conversation.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => RedisService))
    private redisService: RedisService
  ) {}
  private users: User[] = [];

  getAllConversations(id: string): Conversation[] {
    const user = this.users.find(user => user.id === id);
    return user.conversations
  }

  findById(id: string): User {
    return this.users.find(user => user.id === id);
  }

  async create(newUser: Partial<User>): Promise<User> {
      newUser.id = uuidv4();
      newUser.password = await hashPassword(newUser.password);
      newUser.conversations = [];
    await this.redisService.set(`user:${newUser.id}`, newUser);
    return newUser as User;
  }

  async update(newUserInfo: Partial<User>): Promise<User> {
    const user = await this.redisService.get(`user:${newUserInfo.id}`);
    if (user) {
      if(newUserInfo.email){
        user.email = newUserInfo.email;
      }
      if(newUserInfo.pseudo){
        user.pseudo = newUserInfo.pseudo;
      }
      if(newUserInfo.name){
        user.name = newUserInfo.name;
      }
      await this.redisService.set(`user:${user.id}`, user);
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
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.redisService.get(`user:${email}`);
    return user ? (user as User) : null;
  }

  async findAll(): Promise<User[]> {
    const keys = await this.redisService.keys('user:*');
    const users = await Promise.all(keys.map(key => this.redisService.get(key)));
    return users;
  }
}
