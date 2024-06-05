import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { User } from './user.model';
import { hashPassword } from '../auth/auth.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => RedisService))
    private redisService: RedisService
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.redisService.get(`user:${email}`);
    return user ? (user as User) : null;
  }

  async create(user: Partial<User>): Promise<User> {
    user.id = uuidv4();
    user.password = await hashPassword(user.password);
    await this.redisService.set(`user:${user.email}`, user);
    return user as User;
  }

  async findAll(): Promise<User[]> {
    const keys = await this.redisService.keys('user:*');
    const users = await Promise.all(keys.map(key => this.redisService.get(key)));
    return users;
  }
}
