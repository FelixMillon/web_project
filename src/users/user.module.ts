import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { RedisModule } from '../redis/redis.module';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => RedisModule),
    forwardRef(() => DatabaseModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
