import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { bookmarkProviders } from './bookmark.provider';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [DatabaseModule],
  providers: [...bookmarkProviders, BookmarkService],
})
export class BookmarkModule {}
