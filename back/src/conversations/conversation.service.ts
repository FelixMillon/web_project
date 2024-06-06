import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { User } from '../users/user.model';
import { PrismaService } from '../infrastructure/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private prisma: PrismaService
  ) {}

  async create(ownersId: string[], name: string, ): Promise<Conversation> {
    try {
      const insertedConversation = await this.prisma.conversation.create({
          data: {
              name,
              users: {
                connect: ownersId.map(id => ({ id })),
              },
              owners: {
                connect: ownersId.map(id => ({ id })),
              }
          }
      });
      return insertedConversation as Conversation;
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException(`Error while creating new conversation: ${error}`);
        }
    }
    return null;
  }

  async update(id: string, name: string): Promise<Conversation> {
    try {
      const updatedConv = await this.prisma.conversation.update({
          where: { id },
          data: {name}
      });
      return updatedConv as Conversation
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Conversation doesn't exist");
        }
        throw new BadRequestException(`Error while updating conversation: ${error.message}`);
    }
  }

  async join(id: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.conversation.update({
          where: { id },
          data: {
            users: {
              connect: { id: userId },
            },
          }
      });
      return true
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Conversation doesn't exist");
        }
        return false;
    }
  }

  async leave(id: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.conversation.update({
          where: { id },
          data: {
            users: {
              disconnect: { id: userId },
            },
          }
      });
      return true
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Conversation doesn't exist");
        }
        return false;
    }
  }

  async getParticipants(id: string): Promise<User[]> {
    try {
      const conversations = await this.prisma.conversation.findUniqueOrThrow({
          where: {
            id
          },
          include: { users: true },
      });
      return conversations.users as User[]
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

  async getOwners(id: string): Promise<User[]> {
    try {
      const conversations = await this.prisma.conversation.findUniqueOrThrow({
          where: {
            id
          },
          include: { owners: true },
      });
      return conversations.owners as User[]
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
