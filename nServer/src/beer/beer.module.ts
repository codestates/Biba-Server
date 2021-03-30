import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { beerProviders } from './beer.provider';
import { BeerService } from './beer.service';

@Module({
  imports: [DatabaseModule],
  providers: [...beerProviders, BeerService],
})
export class BeerModule {}
