import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './database.service';
const prisma = new PrismaClient();

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
