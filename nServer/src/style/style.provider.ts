import { Connection, Repository } from 'typeorm';
import { Style } from './style.entity'

export const styleProviders = [
    {
        provide: 'STYLE_REPO',
        useFactory: (connection: Connection) => connection.getRepository(Style),
        inject: ['DATABASE_CONNECTION'],
    }
]