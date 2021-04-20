import { Connection } from 'typeorm';
import { Report } from './report.entity';

export const reportProviders = [
  {
    provide: 'REPORT_REPO',
    useFactory: (connection: Connection) => connection.getRepository(Report),
    inject: ['DATABASE_CONNECTION'],
  },
];
