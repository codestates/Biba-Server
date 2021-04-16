import { Connection, Repository } from 'typeorm';
import { ViewCount } from './viewCount.entity'

export const viewCountProviders = [
    {
        provide: 'VIEWCOUNT_REPO',
        useFactory: (connection: Connection) => connection.getRepository(ViewCount),
        inject: ['DATABASE_CONNECTION'],
    }
]