import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { reportProviders } from './report.provider';
import { ReportService } from './report.service';

@Module({
  imports: [DatabaseModule],
  providers: [...reportProviders, ReportService],
})
export class ReportModule {}
