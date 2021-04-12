import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @Inject('TAG_REPO')
    private tagRepo: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepo.find();
  }
}