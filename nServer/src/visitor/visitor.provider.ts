import { Connection, Repository } from 'typeorm';
import { Visitor } from './visitor.entity'

export const visitorProviders = [
    {
        provide: 'VISITOR_REPO',
        useFactory: (connection: Connection) => connection.getRepository(Visitor),
        inject: ['DATABASE_CONNECTION'],
    }
]