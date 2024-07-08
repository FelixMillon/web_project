import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@InjectQueue('message-queue') private messageQueue: Queue) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('requestMessages')
  async handleRequestMessages(@MessageBody() data: any): Promise<void> {
    const jobs = await this.messageQueue.getJobs(['completed', 'waiting', 'active', 'failed', 'delayed']);
    const messages = jobs.map(job => job.data.message);
    this.server.emit('messages', messages);
  }
}
