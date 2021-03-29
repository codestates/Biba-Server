import { Connection, Repository } from 'typeorm';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: 'USER_REPO',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
  },
];
