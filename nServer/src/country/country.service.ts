import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountryService {
  constructor(
    @Inject('COUNTRY_REPO')
    private beerRepo: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.beerRepo.find();
  }
}