import { Connection, Repository } from 'typeorm';
import { Beer } from './beer.entity';

export const beerProviders = [
  {
    provide: 'BEER_REPO',
    useFactory: (connection: Connection) => connection.getRepository(Beer),
    inject: ['DATABASE_CONNECTION'],
  },
];
