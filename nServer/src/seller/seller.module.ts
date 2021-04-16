import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { sellerProviders } from './seller.provider';
import { sellerService } from './seller.service';

@Module({
  imports: [DatabaseModule],
  providers: [...sellerProviders, sellerService],
})
export class SellerModule {}
