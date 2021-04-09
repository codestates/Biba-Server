import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Style } from './style.entity';

@Injectable()
export class StyleService {
  constructor(
    @Inject('STYLE_REPO')
    private styleRepo: Repository<Style>,
  ) {}

  async findAll(): Promise<Style[]> {
    return this.styleRepo.find();
  }
}