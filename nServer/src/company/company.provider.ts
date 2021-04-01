import { Connection, Repository } from 'typeorm';
import { Company } from './company.entity'

export const companyProviders = [
    {
        provide: 'COMPANY_REPO',
        useFactory: (connection: Connection) => connection.getRepository(Company),
        inject: ['DATABASE_CONNECTION'],
    }
]