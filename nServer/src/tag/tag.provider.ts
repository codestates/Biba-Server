import { Connection, Repository } from 'typeorm';
import { Tag } from './tag.entity'

export const tagProviders = [
    {
        provide: 'TAG_REPO',
        useFactory: (connection: Connection) => connection.getRepository(Tag),
        inject: ['DATABASE_CONNECTION'],
    }
]