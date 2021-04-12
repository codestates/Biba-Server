import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';

@Injectable()
export class SellerService {
  constructor(
    @Inject('SELLER_REPO')
    private sellerRepo: Repository<Seller>,
  ) {}

  async findAll(): Promise<Seller[]> {
    return this.sellerRepo.find();
  }
}