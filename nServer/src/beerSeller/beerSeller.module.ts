import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { BeerSellerService } from './beerSeller.service';
import { beerSellerProviders } from './beerSeller.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...beerSellerProviders, BeerSellerService],
})
export class BeerSeller {}
