import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @Inject('BOOKMARK_REPO')
    private bookmarkRepo: Repository<Bookmark>,
  ) {}

  async findAll(): Promise<Bookmark[]> {
    return this.bookmarkRepo.find();
  }
}