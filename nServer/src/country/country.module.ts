import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { countryProviders } from './country.provider';
import { CountryService } from './country.service';

@Module({
  imports: [DatabaseModule],
  providers: [...countryProviders, CountryService],
})
export class CountryModule {}
