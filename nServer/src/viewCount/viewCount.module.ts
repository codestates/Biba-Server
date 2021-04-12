import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { viewCountProviders } from './viewCount.provider';
import { ViewCountService } from './viewCount.service';

@Module({
  imports: [DatabaseModule],
  providers: [...viewCountProviders, ViewCountService],
})
export class ViewCountModule {}
