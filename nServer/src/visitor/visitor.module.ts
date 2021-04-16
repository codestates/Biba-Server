import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { visitorProviders } from './visitor.provider';
import { VisitorService } from './visitor.service';

@Module({
  imports: [DatabaseModule],
  providers: [...visitorProviders, VisitorService],
})
export class VisitorModule {}
