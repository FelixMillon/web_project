import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull'; // Importez Job depuis bullmq, pas depuis @nestjs/bull
import { Job } from 'bullmq';
import { PrismaService } from '../infrastructure/database/database.service';
import { Prisma } from '@prisma/client';
import { SendedMessage } from '../types';

@Processor('message-queue')
export class MessageMQProcessor {
    constructor(
        @Inject(forwardRef(() => PrismaService))
        private prisma: PrismaService
    ) {}
        
    @Process('message-job')
    async handleMessage(job: Job) {
        const message: SendedMessage = job.data.message;
        try {
            const insertedMessage = await this.prisma.message.create({
                data: message
            });
            await job.isCompleted();
            return insertedMessage;
        } catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException(`Error while creating new message: ${error}`);
            }
        }
        return null;
    }
}
