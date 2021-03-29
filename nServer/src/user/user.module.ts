import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { userProviders } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
})
export class UserModule {}
