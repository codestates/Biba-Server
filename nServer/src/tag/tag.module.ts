import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { tagProviders } from './tag.provider';
import { TagService } from './tag.service';

@Module({
  imports: [DatabaseModule],
  providers: [...tagProviders, TagService],
})
export class TagModule {}
