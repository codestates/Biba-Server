import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { graphProviders } from './graph.provider';
import { GraphService } from './graph.service';

@Module({
  imports: [DatabaseModule],
  providers: [...graphProviders, GraphService],
})
export class GraphModule {}
