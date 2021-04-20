import { Connection } from 'typeorm';
import { BeerSeller } from './beerSeller.entity';

export const beerSellerProviders = [
  {
    provide: 'BEERSELLER_REPO',
    useFactory: (connection: Connection) =>
      connection.getRepository(BeerSeller),
    inject: ['DATABASE_CONNECTION'],
  },
];
