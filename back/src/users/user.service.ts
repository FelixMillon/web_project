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

  async getAllConversations(id: string): Promise<Conversation[] | null> {
    const user = await this.findById(id)
    return user.conversations
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
          where: {
            id
          },
          include: {
            conversations: true
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

  async create(newUser: Partial<User>): Promise<User> {
    newUser.password = await hashPassword(newUser.password);
    const inserted = await this.prisma.user.create({
        data: {
          email: newUser.email,
          pseudo: newUser.pseudo,
          name: newUser.name,
          password: newUser.password
        },
        include: {
          conversations: true
        }
    });
    return inserted as User;
  }

  async update(id: string ,newUserInfo: Partial<User | null>): Promise<User> {
    if (await this.findById(id)) {
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
            data: updates,
            include: {
              conversations: true
            }
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

  async delete(id: string): Promise<boolean> {
      try {
        await this.prisma.user.delete({
            where: { id }
        });
        return true;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Task doesn't exist");
        }
        throw new BadRequestException(`Error while deleting task: ${error.message}`);
    }
    return false;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
          where: {
            email
          },
          include: {
            conversations: true
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
      const users = await this.prisma.user.findMany(
        {
          include: {
            conversations: true
          }
        });
      return users as User[]
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new BadRequestException("Error while getting user");
      }
    }
    return null
  }
}
