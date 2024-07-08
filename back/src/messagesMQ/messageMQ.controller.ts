import { Controller, Post, Param, Body } from '@nestjs/common';
import { UnauthorizedException  } from '@nestjs/common';
import { MessageMQService } from './messageMQ.service';
import { getPayload } from '../auth/auth.util';
import { SendedMessage} from '../types'

@Controller('message')
export class MessageMQController {
  constructor(private readonly messageService: MessageMQService) {}

  @Post('publish')
  async publishMessage(
    @Body() body: Object,
    @Body('conversationId') conversationId: string,
    @Body('eventType') eventType: string,
    @Body('token') token: string,
    @Body('content') content: string
  ) {
    const payload = getPayload(token)
    const message: SendedMessage = {
        conversationId,
        eventType,
        authorId: payload.id,
        content
    }
    await this.messageService.publishMessage(message);
  }

}
