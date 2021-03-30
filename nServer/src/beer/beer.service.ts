import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Beer } from './beer.entity';

@Injectable()
export class BeerService {
  constructor(
    @Inject('BEER_REPO')
    private beerRepo: Repository<Beer>,
  ) {}

  async findAll(): Promise<Beer[]> {
    return this.beerRepo.find();
  }
}