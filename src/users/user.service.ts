import { Injectable, Inject, forwardRef, BadRequestException  } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { hashPassword } from '../auth/auth.util';
import { User } from './user.model';
import { Conversation } from '../conversations/conversation.model';
import { PrismaService } from '../infrastructure/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => RedisService))
    private redisService: RedisService,
    @Inject(forwardRef(() => PrismaService))
    private prisma: PrismaService
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
    newUser.password = await hashPassword(newUser.password);
    const inserted = await this.prisma.user.create({
        data: {
          email: newUser.email,
          pseudo: newUser.pseudo,
          name: newUser.name,
          password: newUser.password
        }
    });
    return inserted as User;
  }

  async update(id: string ,newUserInfo: Partial<User | null>): Promise<User> {
    if (await this.findOneById(id)) {
      let updates = {}
      if(newUserInfo.email){
        updates["email"] = newUserInfo.email;
      }
      if(newUserInfo.pseudo){
        updates["pseudo"] = newUserInfo.pseudo;
      }
      if(newUserInfo.name){
        updates["name"] = newUserInfo.name;
      }
      try {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updates
        });
        return updatedUser as User
      } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
              throw new BadRequestException("User doesn't exist");
          }
          throw new BadRequestException(`Error while updating user: ${error.message}`);
      }
    }
    return null
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
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
          where: {
            email
          }
      });
      return user as User
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
              throw new BadRequestException("User doesn't exist");
          }
          throw new BadRequestException("Error while getting user");
      }
    }
    return null
  }

  async findAll(): Promise<User[] | null> {
    try {
      const users = await this.prisma.user.findMany({});
      return users as User[]
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new BadRequestException("Error while getting user");
      }
    }
    return null
  }

  async findOneById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
          where: {
            id
          }
      });
      return user as User
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
              throw new BadRequestException("User doesn't exist");
          }
          throw new BadRequestException("Error while getting user");
      }
    }
    return null
  }
}
