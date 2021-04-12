import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';

@Injectable()
export class VisitorService {
  constructor(
    @Inject('VISITOR_REPO')
    private visitorRepo: Repository<Visitor>,
  ) {}

  async findAll(): Promise<Visitor[]> {
    return this.visitorRepo.find();
  }
}