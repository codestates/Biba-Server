import { Connection, Repository } from 'typeorm';
import { Seller } from './seller.entity'

export const sellerProviders = [
    {
        provide: 'SELLER_REPO',
        useFactory: (connection: Connection) => connection.getRepository(Seller),
        inject: ['DATABASE_CONNECTION'],
    }
]