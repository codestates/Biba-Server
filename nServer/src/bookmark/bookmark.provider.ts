import { Connection, Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';

export const bookmarkProviders = [
  {
    provide: 'BOOKMARK_REPO',
    useFactory: (connection: Connection) => connection.getRepository(Bookmark),
    inject: ['DATABASE_CONNECTION'],
  },
];
