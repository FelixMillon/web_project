import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/database.service';
import { Message } from './message.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private prisma: PrismaService
  ) {}


  async publish(
    conversationId: string,
    eventType: string,
    authorId: string,
    content: string
  ): Promise<Partial<Message>> {
    try {
      const insertedMessage = await this.prisma.message.create({
          data: {
              conversationId,
              eventType,
              authorId,
              content
          }
      });
      return insertedMessage;
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException(`Error while creating new message: ${error}`);
        }
    }
    return null;
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.prisma.message.delete({
          where: { id }
      });
      return true;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Message doesn't exist");
        }
        throw new BadRequestException(`Error while deleting message: ${error.message}`);
    }
  }

  async deleteByAuthor(authorId: string): Promise<boolean> {
    try {
      await this.prisma.message.deleteMany({
          where: { authorId }
      });
      return true;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Message doesn't exist");
        }
        throw new BadRequestException(`Error while deleting message: ${error.message}`);
    }
  }

  async deleteByConversationId(conversationId: string): Promise<boolean> {
    try {
      await this.prisma.message.deleteMany({
          where: { conversationId }
      });
      return true;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new BadRequestException("Message doesn't exist");
        }
        throw new BadRequestException(`Error while deleting message: ${error.message}`);
    }
  }

  async getById(id: string): Promise<Partial<Message>> {
    try {
      const message = await this.prisma.message.findUniqueOrThrow({
          where: {
            id
          }
      });
      return message
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

  async getByAuthor(authorId: string): Promise<Partial<Message>[]> {
    try {
      const messages = await this.prisma.message.findMany({
          where: {
            authorId
          }
      });
      return messages
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
