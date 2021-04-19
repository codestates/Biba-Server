import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { beerTagProviders } from './beerTag.provider';
import { BeerTagService } from './beerTag.service';

@Module({
  imports: [DatabaseModule],
  providers: [...beerTagProviders, BeerTagService],
})
export class BeerTagModule {}
