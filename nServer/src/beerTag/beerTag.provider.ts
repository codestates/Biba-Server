import { Connection } from 'typeorm';
import { BeerTag } from './beerTag.entity';

export const beerTagProviders = [
  {
    provide: 'BEERTAG_REPO',
    useFactory: (connection: Connection) => connection.getRepository(BeerTag),
    inject: ['DATABASE_CONNECTION'],
  },
];
