import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_REPO')
    private beerRepo: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.beerRepo.find();
  }
}