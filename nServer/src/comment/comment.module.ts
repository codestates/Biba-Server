import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { commentProviders } from './comment.provider';
import { CommentService } from './comment.service';

@Module({
  imports: [DatabaseModule],
  providers: [...commentProviders, CommentService],
})
export class CommentModule {}
