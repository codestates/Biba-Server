import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { styleProviders } from './style.provider';
import { StyleService } from './style.service';

@Module({
  imports: [DatabaseModule],
  providers: [...styleProviders, StyleService],
})
export class StyleModule {}
