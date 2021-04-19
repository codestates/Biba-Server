import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { sellerProviders } from './seller.provider';
import { SellerService } from './seller.service';

@Module({
  imports: [DatabaseModule],
  providers: [...sellerProviders, SellerService],
})
export class SellerModule {}
