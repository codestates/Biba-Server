import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ViewCount } from './viewCount.entity';

@Injectable()
export class ViewCountService {
  constructor(
    @Inject('VIEWCOUNT_REPO')
    private viewCountRepo: Repository<ViewCount>,
  ) {}

  async findAll(): Promise<ViewCount[]> {
    return this.viewCountRepo.find();
  }
}