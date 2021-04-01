import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { companyProviders } from './company.provider';
import { CompanyService } from './company.service';

@Module({
  imports: [DatabaseModule],
  providers: [...companyProviders, CompanyService],
})
export class CompanyModule {}
